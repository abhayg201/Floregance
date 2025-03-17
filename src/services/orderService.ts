
import { supabase } from '@/lib/supabase';
import type { Product } from '@/data/products';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id?: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment_intent_id?: string;
  created_at?: string;
}

// Create a new order
export const createOrder = async (order: Omit<Order, 'id' | 'created_at'>): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select('id')
      .single();
    
    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

// Get orders for a user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as Order[];
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    return [];
  }
};

// Get a single order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    
    if (error) throw error;
    
    return data as Order;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    return false;
  }
};
