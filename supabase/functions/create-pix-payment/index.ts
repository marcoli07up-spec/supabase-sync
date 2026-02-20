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

    // ======= CHAVE PIX ATUALIZADA =======
    const PIX_KEY = "470e1c06-a98c-4fd9-ad77-e221114722bc";
    const PIX_NAME = "PONTO DAS UTILIDADES";
    const PIX_CITY = "SAOPAULO";

    const pixCode = gerarPixCopiaECola({
      chave: PIX_KEY,
      nome: PIX_NAME,
      cidade: PIX_CITY,
      valor: Number(order.total || 0),
      txid: String(orderId),
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
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error creating PIX payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
