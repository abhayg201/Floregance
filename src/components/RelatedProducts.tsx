
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Product } from '@/data/products';

interface RelatedProductsProps {
  products: Product[];
  category: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, category }) => {
  if (products.length === 0) return null;

  return (
    <div className="border-t border-border pt-12">
      <div className="flex justify-between items-end mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-medium">
          You Might Also Like
        </h2>
        <Link
          to={`/products?category=${category}`}
          className="text-primary hover:text-primary/80 transition-colors flex items-center"
        >
          <span>See all {category}</span>
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="group">
            <Link to={`/products/${product.id}`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-craft-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-foreground/70 text-sm">{product.artisan}</p>
                <p className="mt-1 font-medium">₹{product.price.toLocaleString()}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
