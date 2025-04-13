
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
        payment_data: paymentData
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
