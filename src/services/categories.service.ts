import { supabase } from "@/lib/supabase";

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  }


export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data;
}