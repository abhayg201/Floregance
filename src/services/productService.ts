import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/product';

// Fetch all products from Supabase
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    
    return data as Product[];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Fetch a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true);
    
    if (error) throw error;
    
    return data as Product[];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    
    return data as Product[];
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
};

// Search products by query
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%, artisan.ilike.%${query}%, category.ilike.%${query}%`);
    
    if (error) throw error;
    
    return data as Product[];
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    return [];
  }
};
