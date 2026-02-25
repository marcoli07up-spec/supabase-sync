import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ===== PIX EMV / CRC16 (Para Modo Manual) =====
function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function formatField(id: string, value: string) {
  const v = value ?? "";
  const len = v.length.toString().padStart(2, "0");
  return `${id}${len}${v}`;
}

function gerarPixManual(params: { chave: string; nome: string; cidade: string; valor: number; txid?: string }) {
  const chave = (params.chave || "").trim();
  const nome = (params.nome || "").trim();
  const cidade = (params.cidade || "").trim();
  const txid = (params.txid || "***").trim().slice(0, 25) || "***";

  const merchantAccountInfo = [
    formatField("00", "br.gov.bcb.pix"),
    formatField("01", chave),
  ].join("");

  const payloadSemCRC = [
    formatField("00", "01"),
    formatField("26", merchantAccountInfo),
    formatField("52", "0000"),
    formatField("53", "986"),
    formatField("54", Number(params.valor).toFixed(2)),
    formatField("58", "BR"),
    formatField("59", nome.slice(0, 25)),
    formatField("60", cidade.slice(0, 15)),
    formatField("62", formatField("05", txid)),
    "6304",
  ].join("");

  return payloadSemCRC + crc16(payloadSemCRC);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const orderId = body?.orderId;

    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Buscar pedido e configurações
    const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single();
    const { data: settingsData } = await supabase.from("site_settings").select("value").eq("key", "pix_config").single();
    
    const settings = settingsData?.value || {};
    const mode = settings.pix_mode || 'manual';

    let pixCode = "";
    let qrCodeImage = null;

    if (mode === 'street_pay' && settings.street_pay_api_key) {
      // Chamada para API da Street Pay
      try {
        const response = await fetch("https://api.streetpayments.com.br/v1/transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${settings.street_pay_api_key}`
          },
          body: JSON.stringify({
            amount: Math.round(order.total * 100), // Centavos
            payment_method: "pix",
            external_id: order.id,
            customer: {
              name: order.customer_name,
              email: order.customer_email,
              cpf_cnpj: order.customer_cpf.replace(/\D/g, ''),
              phone: order.customer_phone.replace(/\D/g, '')
            }
          })
        });

        const data = await response.json();
        if (data.pix_code) {
          pixCode = data.pix_code;
          qrCodeImage = data.pix_qr_code_url;
        } else {
          throw new Error("Street Pay failed to return PIX code");
        }
      } catch (e) {
        console.error("Street Pay Error:", e);
        // Fallback para manual se a API falhar
        pixCode = gerarPixManual({
          chave: settings.pix_key,
          nome: settings.merchant_name,
          cidade: settings.merchant_city,
          valor: order.total,
          txid: order.id.slice(0, 8)
        });
      }
    } else {
      // Modo Manual
      pixCode = gerarPixManual({
        chave: settings.pix_key,
        nome: settings.merchant_name,
        cidade: settings.merchant_city,
        valor: order.total,
        txid: order.id.slice(0, 8)
      });
    }

    // Salvar no pedido
    await supabase
      .from("orders")
      .update({
        pix_code: pixCode,
        pix_qr_code: pixCode,
        pix_qr_code_image: qrCodeImage,
        status: "awaiting_payment",
      })
      .eq("id", orderId);

    return new Response(JSON.stringify({ success: true, pixQrCode: pixCode, pixQrCodeImage: qrCodeImage }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});