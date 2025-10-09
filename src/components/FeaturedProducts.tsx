
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getAllProducts } from '@/services/productService';
import { Product } from '@/types/product';
import LoadingSpinner from './LoadingSpinner';

const FeaturedProducts = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);
  
  return (
    <section className="section-container">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span className="text-sm uppercase tracking-wider text-primary">Our Collection</span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium mt-2">All Products</h2>
          <p className="text-foreground/70 mt-3 max-w-2xl">
            Discover our complete collection of handcrafted treasures from talented artisans around the world, each piece telling a unique story of artisanal excellence and cultural heritage.
          </p>
        </div>
        <Link to="/products" className="inline-flex items-center mt-4 md:mt-0 text-primary hover:text-primary/80 transition-colors group">
          <span className="font-medium">View All Products</span>
          <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner />
        </div>
      ) : allProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-foreground/70">No products available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
