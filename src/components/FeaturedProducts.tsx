
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from '@/data/products';

const FeaturedProducts = () => {
  // Select 4 featured products
  const featuredProducts = products.filter(product => product.featured).slice(0, 4);
  
  return (
    <section className="section-container">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="text-sm uppercase tracking-wider text-primary">Curated Selection</span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium mt-2">Featured Products</h2>
          <p className="text-foreground/70 mt-3 max-w-2xl">
            Discover our handpicked collection of exceptional handcrafted treasures, each telling a unique story of artisanal excellence and cultural heritage.
          </p>
        </div>
        <Link to="/products" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:text-primary/80 transition-colors group">
          <span className="font-medium">View All Products</span>
          <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
