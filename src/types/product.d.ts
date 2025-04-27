
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  images: string[];
  category: string;
  origin: string;
  materials: string[];
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  inStock: boolean;
  featured: boolean;
  new: boolean;
  bestseller: boolean;
  specifications?: Record<string, string>;
}
