
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import CryptoJS from 'https://esm.sh/crypto-js@4.1.1';

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || '';
const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || '';

// Create a Supabase client with the service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to create Razorpay order
async function createRazorpayOrder(amount: number, receipt: string) {
  console.log(`Creating Razorpay order for amount: ${amount}, receipt: ${receipt}`);

  const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
  
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // Convert to lowest currency unit (paise)
      currency: 'INR',
      receipt: receipt,
      notes: {
        order_id: receipt
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Razorpay API error:', errorData);
    throw new Error(`Razorpay API error: ${response.status} ${errorData}`);
  }

  const result = await response.json();
  console.log('Razorpay order created:', result);
  
  return result;
}

// Function to verify Razorpay payment signature
function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  try {
    const generatedSignature = CryptoJS.HmacSHA256(
      orderId + '|' + paymentId,
      razorpayKeySecret
    ).toString(CryptoJS.enc.Hex);

    return generatedSignature === signature;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

// Function to verify webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  try {
    const expectedSignature = CryptoJS.HmacSHA256(
      payload,
      razorpayWebhookSecret
    ).toString(CryptoJS.enc.Hex);

    return expectedSignature === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Update order status in Supabase
async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }
  return true;
}

// Update payment record in Supabase
async function updatePaymentRecord(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  status: string,
  paymentData: any
) {
  const { error } = await supabase
    .from('razorpay_payments')
    .update({
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      status,
      payment_data: paymentData,
      updated_at: new Date().toISOString()
    })
    .eq('razorpay_order_id', razorpayOrderId);

  if (error) {
    console.error('Error updating payment record:', error);
    return false;
  }
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    
    console.log(`Processing request for path: ${path}`);
    
    // Create order endpoint
    if (path.endsWith('/create-order')) {
      const { amount, orderId, user_id } = await req.json();
      
      console.log(`Creating order with amount: ${amount}, orderId: ${orderId}, user_id: ${user_id}`);
      
      if (!amount || !orderId || !user_id) {
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Check if user owns this order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user_id)
        .single();

      if (orderError || !orderData) {
        console.error('Order not found or not authorized:', orderError);
        return new Response(
          JSON.stringify({ error: 'Order not found or not authorized' }),
          { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      try {
        const razorpayOrder = await createRazorpayOrder(amount, orderId);
        
        // Create payment record in database
        const { data: paymentData, error: paymentError } = await supabase
          .from('razorpay_payments')
          .insert({
            order_id: orderId,
            razorpay_order_id: razorpayOrder.id,
            amount,
            currency: 'INR',
            status: 'created'
          })
          .select()
          .single();

        if (paymentError) {
          console.error('Error creating payment record:', paymentError);
        }

        return new Response(
          JSON.stringify({
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            key: razorpayKeyId
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return new Response(
          JSON.stringify({ error: error.message || 'Error creating Razorpay order' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }
    
    // Payment verification endpoint
    else if (path.endsWith('/verify-payment')) {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

      console.log(`Verifying payment: orderId=${razorpay_order_id}, paymentId=${razorpay_payment_id}`);

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return new Response(
          JSON.stringify({ error: 'Missing payment verification parameters' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Verify signature
      const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      if (!isValid) {
        return new Response(
          JSON.stringify({ verified: false, error: 'Invalid signature' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Get order ID from payment record
      const { data: paymentData, error: paymentError } = await supabase
        .from('razorpay_payments')
        .select('order_id')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

      if (paymentError || !paymentData) {
        return new Response(
          JSON.stringify({ verified: false, error: 'Payment record not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Update payment status
      const paymentUpdateSuccess = await updatePaymentRecord(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        'captured',
        null
      );

      // Update order status 
      const orderUpdateSuccess = await updateOrderStatus(paymentData.order_id, 'processing');

      return new Response(
        JSON.stringify({
          verified: true,
          orderId: paymentData.order_id,
          paymentUpdated: paymentUpdateSuccess,
          orderUpdated: orderUpdateSuccess
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Webhook handler (for payment status updates)
    else if (path.endsWith('/webhook')) {
      const signature = req.headers.get('x-razorpay-signature') || '';
      const payload = await req.text();
      
      if (!signature) {
        return new Response(
          JSON.stringify({ error: 'Missing webhook signature' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      const isValidSignature = verifyWebhookSignature(payload, signature);
      if (!isValidSignature) {
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      // Process the webhook payload
      const payloadJson = JSON.parse(payload);
      console.log('Webhook received:', payloadJson);
      
      // Handle different event types
      const event = payloadJson.event;
      
      if (event === 'payment.authorized' || event === 'payment.captured') {
        const payment = payloadJson.payload.payment.entity;
        const orderId = payment.notes?.order_id;
        
        if (orderId) {
          // Update payment status
          await updatePaymentRecord(
            payment.order_id,
            payment.id,
            '',  // No signature in webhook
            event === 'payment.captured' ? 'captured' : 'authorized',
            payment
          );
          
          // Update order status
          if (event === 'payment.captured') {
            await updateOrderStatus(orderId, 'processing');
          }
        }
      }
      
      return new Response(
        JSON.stringify({ received: true }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Default response for unhandled paths
    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
