import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const payload = await req.json();
    console.log("PodPay webhook received:", JSON.stringify(payload));

    const { event, data } = payload;

    if (!data?.id) {
      return new Response(JSON.stringify({ error: "Missing transaction id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map PodPay status to our order status
    let orderStatus: string | null = null;
    switch (event) {
      case "transaction.completed":
        orderStatus = "paid";
        break;
      case "transaction.failed":
        orderStatus = "cancelled";
        break;
      case "transaction.pending":
        orderStatus = "awaiting_payment";
        break;
      case "transaction.refunded":
        orderStatus = "cancelled";
        break;
      default:
        console.log("Unhandled webhook event:", event);
    }

    if (orderStatus) {
      const { error } = await supabase
        .from("orders")
        .update({ status: orderStatus })
        .eq("podpay_transaction_id", data.id);

      if (error) {
        console.error("Error updating order:", error);
      } else {
        console.log(`Order updated to ${orderStatus} for transaction ${data.id}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
