import { supabase } from '@/lib/supabase';
import type { Order } from './orderService';

export interface RazorpayPayment {
  id: string;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  payment_data?: any;
  created_at?: string;
  updated_at?: string;
}

// Create a new Razorpay payment record
export const createPaymentRecord = async (
  orderId: string,
  razorpayOrderId: string,
  amount: number,
  currency: string = 'INR'
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('razorpay_payments')
      .insert({
        order_id: orderId,
        razorpay_order_id: razorpayOrderId,
        amount,
        currency,
        status: 'created'
      })
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error creating payment record:', error);
    return null;
  }
};

// Update payment status after verification
export const updatePaymentStatus = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  status: RazorpayPayment['status'],
  paymentData?: any
): Promise<boolean> => {
  try {
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
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    return false;
  }
};

// Get payment by order ID
export const getPaymentByOrderId = async (orderId: string): Promise<RazorpayPayment | null> => {
  try {
    const { data, error } = await supabase
      .from('razorpay_payments')
      .select('*')
      .eq('order_id', orderId)
      .single();
    
    if (error) throw error;
    
    return data as RazorpayPayment;
  } catch (error) {
    console.error(`Error fetching payment for order ${orderId}:`, error);
    return null;
  }
};

// Load Razorpay Script
export const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay Payment
export const initializeRazorpayPayment = async (
  orderData: {
    id: string;
    amount: number;
    currency: string;
    key: string;
  },
  userInfo: {
    name: string;
    email: string;
    contact: string;
  },
  orderId: string,
  onSuccess: (response: any) => void
) => {
  const options = {
    key: orderData.key,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "Craft Bazaar",
    description: "Order Payment",
    order_id: orderData.id,
    handler: onSuccess,
    prefill: {
      name: userInfo.name,
      email: userInfo.email,
      contact: userInfo.contact
    },
    notes: {
      order_id: orderId
    },
    theme: {
      color: "#693423"
    }
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
  
  razorpay.on('payment.failed', function(response: any){
    console.error('Payment failed:', response.error);
  });
};

// Verify payment with Razorpay signature
export const verifyRazorpayPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('razorpay/verify-payment', {
      body: {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature
      },
    });

    if (error) {
      console.error('Payment verification error:', error);
      return false;
    }

    return data.verified === true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};
