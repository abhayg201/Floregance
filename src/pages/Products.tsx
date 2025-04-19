import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { X, Filter, Check } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 30000 });
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    let filtered = [...products];
    
    if (searchParam) {
      const query = searchParam.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.artisan.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(
        product => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    filtered = filtered.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered = filtered.filter(product => product.new).concat(
          filtered.filter(product => !product.new)
        );
        break;
      case "bestsellers":
        filtered = filtered.filter(product => product.bestseller).concat(
          filtered.filter(product => !product.bestseller)
        );
        break;
      case "featured":
      default:
        filtered = filtered.filter(product => product.featured).concat(
          filtered.filter(product => !product.featured)
        );
        break;
    }
    
    setFilteredProducts(filtered);
  }, [searchParams, selectedCategory, sortOption, priceRange, searchQuery]);
  
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    
    if (category) {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    
    setSearchParams(searchParams);
  };
  
  const clearSearchQuery = () => {
    setSearchQuery(null);
    searchParams.delete('search');
    setSearchParams(searchParams);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-medium">
                {searchQuery 
                  ? `Search Results for "${searchQuery}"` 
                  : selectedCategory 
                    ? `${selectedCategory} Collection` 
                    : "All Products"}
              </h1>
              <p className="text-foreground/70 mt-2">
                {searchQuery 
                  ? `Found ${filteredProducts.length} products matching your search.`
                  : "Discover our collection of handcrafted treasures from talented artisans around the world."}
              </p>
            </div>
            
            {(selectedCategory || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 rounded-md text-sm"
                  >
                    <span>Category: {selectedCategory}</span>
                    <X size={14} />
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={clearSearchQuery}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 rounded-md text-sm"
                  >
                    <span>Search: {searchQuery}</span>
                    <X size={14} />
                  </button>
                )}
              </div>
            )}
            
            <div className="flex md:hidden justify-between items-center mb-6">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md text-sm"
              >
                <Filter size={16} />
                <span>Filter & Sort</span>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="hidden md:block w-full md:w-64 flex-shrink-0">
                <div className="sticky top-28 p-6 border border-border rounded-lg bg-white">
                  <h3 className="font-medium text-lg mb-4">Categories</h3>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        !selectedCategory ? "bg-primary text-white" : "hover:bg-craft-100"
                      )}
                    >
                      All Products
                    </button>
                    
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                          selectedCategory === category ? "bg-primary text-white" : "hover:bg-craft-100"
                        )}
                      >
                        <span>{category}</span>
                        {selectedCategory === category && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium text-lg mb-4">Price Range</h3>
                    <div className="px-3">
                      <div className="flex justify-between mb-2 text-sm">
                        <span>₹{priceRange.min.toLocaleString('en-IN')}</span>
                        <span>₹{priceRange.max.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30000"
                        step="1000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                className={cn(
                  "fixed inset-0 bg-white z-40 transition-transform transform duration-300 ease-out-sine pt-20",
                  showFilter ? "translate-y-0" : "translate-y-full"
                )}
              >
                <div className="container mx-auto px-6 py-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-medium text-lg">Filter & Sort</h3>
                    <button 
                      onClick={() => setShowFilter(false)}
                      className="text-foreground/70"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleCategoryChange(null);
                          setShowFilter(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          !selectedCategory ? "bg-primary text-white" : "hover:bg-craft-100"
                        )}
                      >
                        All Products
                      </button>
                      
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            handleCategoryChange(category);
                            setShowFilter(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                            selectedCategory === category ? "bg-primary text-white" : "hover:bg-craft-100"
                          )}
                        >
                          <span>{category}</span>
                          {selectedCategory === category && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="px-3">
                      <div className="flex justify-between mb-2 text-sm">
                        <span>₹{priceRange.min.toLocaleString('en-IN')}</span>
                        <span>₹{priceRange.max.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30000"
                        step="1000"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Sort By</h4>
                    <div className="space-y-2">
                      {[
                        { value: "featured", label: "Featured" },
                        { value: "price-low", label: "Price: Low to High" },
                        { value: "price-high", label: "Price: High to Low" },
                        { value: "newest", label: "Newest" },
                        { value: "bestsellers", label: "Bestsellers" },
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortOption(option.value);
                            setShowFilter(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                            sortOption === option.value ? "bg-primary text-white" : "hover:bg-craft-100"
                          )}
                        >
                          <span>{option.label}</span>
                          {sortOption === option.value && <Check size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="hidden md:flex justify-between items-center mb-6">
                  <p className="text-foreground/70">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-foreground/70">Sort by:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest</option>
                      <option value="bestsellers">Bestsellers</option>
                    </select>
                  </div>
                </div>
                
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <h3 className="text-xl font-medium mb-2">No products found</h3>
                    <p className="text-foreground/70 mb-6">
                      Try adjusting your filters or browse our other collections.
                    </p>
                    <button
                      onClick={() => {
                        handleCategoryChange(null);
                        setPriceRange({ min: 0, max: 30000 });
                        setSortOption("featured");
                        clearSearchQuery();
                      }}
                      className="btn-primary"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
