import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ===== PIX EMV / CRC16 =====
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

// Gera Pix "copia e cola" para chave estática
function gerarPixCopiaECola(params: {
  chave: string;
  nome: string;
  cidade: string;
  valor: number;
  txid?: string;
}) {
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

// Gera URL do Street Pay
function gerarUrlStreetPay(params: {
  merchantName: string;
  merchantCity: string;
  valor: number;
  txid: string;
}) {
  const { merchantName, merchantCity, valor, txid } = params;
  const encodedName = encodeURIComponent(merchantName);
  const encodedCity = encodeURIComponent(merchantCity);
  const valorFormatado = valor.toFixed(2).replace('.', ',');
  
  return `https://app.streetpayments.com.br/pix?name=${encodedName}&city=${encodedCity}&amount=${valorFormatado}&txid=${txid}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY",
    )!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json().catch(() => ({}));
    const orderId = body?.orderId;

    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Buscar pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Buscar configuração de PIX
    const { data: settings, error: settingsError } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "pix_config")
      .maybeSingle();

    if (settingsError || !settings?.value || typeof settings.value !== 'object') {
      return new Response(JSON.stringify({ error: "PIX config not found" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = settings.value as {
      enabled: boolean;
      pix_key: string;
      merchant_name: string;
      merchant_city: string;
      checkout_type: 'receiver' | 'streetpay';
      whatsapp_threshold_value: number;
    };

    if (!config.enabled) {
      return new Response(JSON.stringify({ error: "PIX not enabled" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const valor = Number(order.total || 0);
    const txid = String(orderId);

    if (config.checkout_type === 'streetpay' && valor >= (config.whatsapp_threshold_value || 2500)) {
      // Usa Street Pay
      const streetUrl = gerarUrlStreetPay({
        merchantName: config.merchant_name,
        merchantCity: config.merchant_city,
        valor,
        txid,
      });

      // Salvar no pedido
      await supabase
        .from("orders")
        .update({
          pix_code: streetUrl,
          pix_qr_code: null,
          pix_qr_code_image: null,
          podpay_transaction_id: null,
          status: "awaiting_payment",
        })
        .eq("id", orderId);

      return new Response(
        JSON.stringify({
          success: true,
          pixQrCode: streetUrl,
          pixQrCodeImage: null,
          transactionId: orderId,
          method: 'streetpay',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    } else {
      // Usa chave PIX direta
      if (!config.pix_key) {
        return new Response(JSON.stringify({ error: "PIX key is required for receiver mode" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const pixCode = gerarPixCopiaECola({
        chave: config.pix_key,
        nome: config.merchant_name,
        cidade: config.merchant_city,
        valor,
        txid,
      });

      // Salvar no pedido
      await supabase
        .from("orders")
        .update({
          pix_code: pixCode,
          pix_qr_code: pixCode,
          pix_qr_code_image: null,
          podpay_transaction_id: null,
          status: "awaiting_payment",
        })
        .eq("id", orderId);

      return new Response(
        JSON.stringify({
          success: true,
          pixQrCode: pixCode,
          pixQrCodeImage: null,
          transactionId: orderId,
          method: 'receiver',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  } catch (error: unknown) {
    console.error("Error creating PIX payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});