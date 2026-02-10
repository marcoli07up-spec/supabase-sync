import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PODPAY_API_KEY = Deno.env.get("PODPAY_API_KEY");
    if (!PODPAY_API_KEY) {
      throw new Error("PODPAY_API_KEY is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { orderId } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch order and items
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

    const { data: orderItems } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    // Build PodPay transaction with generic product names
    const amountInCents = Math.round(order.total * 100);
    const genericNames = [
      "Acessório Fotográfico Premium", "Kit Equipamento Digital", "Componente Eletrônico Pro",
      "Periférico Multimídia HD", "Dispositivo Tecnológico Plus", "Módulo Óptico Avançado",
      "Adaptador Universal Tech", "Suporte Profissional Studio", "Peça de Reposição Original",
      "Acessório Multifuncional Pro", "Equipamento Digital Compacto", "Item Técnico Especializado",
    ];
    const items = (orderItems || []).map((item: any, index: number) => ({
      title: genericNames[index % genericNames.length],
      unitPrice: Math.round(item.price * 100),
      quantity: item.quantity,
      tangible: true,
    }));

    // Build postback URL
    const functionUrl = `${SUPABASE_URL}/functions/v1/podpay-webhook`;

    const transactionBody: any = {
      paymentMethod: "pix",
      postbackUrl: functionUrl,
      customer: {
        document: {
          type: "cpf",
          number: (order.customer_cpf || "").replace(/\D/g, ""),
        },
        name: order.customer_name,
        email: order.customer_email || "noemail@icamstore.com",
        phone: (order.customer_phone || "").replace(/\D/g, ""),
      },
      amount: amountInCents,
      items,
    };

    // Add delivery info if available
    if (order.customer_address) {
      transactionBody.delivery = {
        street: order.customer_address,
        city: order.customer_city || "",
        state: order.customer_state || "",
        zipcode: (order.customer_cep || "").replace(/\D/g, ""),
      };
    }

    console.log("Creating PodPay transaction:", JSON.stringify(transactionBody));

    const podpayResponse = await fetch("https://api.podpay.app/v1/transactions", {
      method: "POST",
      headers: {
        "x-api-key": PODPAY_API_KEY,
        "Content-Type": "application/json",
        "X-Idempotency-Key": orderId,
      },
      body: JSON.stringify(transactionBody),
    });

    const podpayData = await podpayResponse.json();
    console.log("PodPay response:", JSON.stringify(podpayData));

    if (!podpayResponse.ok || !podpayData.success) {
      console.error("PodPay error:", podpayData);
      return new Response(
        JSON.stringify({
          error: "Failed to create PIX payment",
          details: podpayData.error?.message || "Unknown error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const txData = podpayData.data;

    // Update order with PodPay transaction data
    await supabase
      .from("orders")
      .update({
        podpay_transaction_id: txData.id,
        pix_qr_code: txData.pixQrCode || null,
        pix_qr_code_image: txData.pixQrCodeImage || null,
        pix_code: txData.pixQrCode || null,
        status: "awaiting_payment",
      })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({
        success: true,
        pixQrCode: txData.pixQrCode,
        pixQrCodeImage: txData.pixQrCodeImage,
        transactionId: txData.id,
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
