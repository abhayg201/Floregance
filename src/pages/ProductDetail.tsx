
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag, Heart, Share, ChevronRight, Minus, Plus, ArrowLeft } from 'lucide-react';
import Newsletter from '@/components/Newsletter';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  const product = products.find(p => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // If product is not found, redirect to products page
  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);
  
  if (!product) {
    return null;
  }
  
  const handleAddToCart = () => {
    // Add the product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${quantity}) has been added to your cart.`,
      duration: 3000
    });
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="flex items-center text-sm text-foreground/60">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} className="mx-2" />
              <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight size={12} className="mx-2" />
              <Link to={`/products?category=${product.category}`} className="hover:text-foreground transition-colors">
                {product.category}
              </Link>
              <ChevronRight size={12} className="mx-2" />
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative aspect-[4/5] bg-craft-50 rounded-lg overflow-hidden">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-craft-100 animate-pulse" />
                  )}
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className={`object-cover w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                </div>
                
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(index);
                        setImageLoaded(false);
                      }}
                      className={cn(
                        "relative aspect-[4/5] w-20 h-20 overflow-hidden rounded-md flex-shrink-0 border-2",
                        selectedImage === index ? "border-primary" : "border-transparent"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - view ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col">
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">{product.name}</h1>
                  <p className="text-foreground/70 mb-3">By {product.artisan} from {product.origin}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-2xl font-medium">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="ml-3 text-foreground/60 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-foreground/80 mb-8">
                    {product.description}
                  </p>
                  
                  {/* Add to Cart */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-input rounded-md">
                        <button
                          onClick={decrementQuantity}
                          className="px-3 py-2 text-foreground/70 hover:text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center">{quantity}</span>
                        <button
                          onClick={incrementQuantity}
                          className="px-3 py-2 text-foreground/70 hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button
                        onClick={handleAddToCart}
                        className="btn-primary flex-1"
                      >
                        <ShoppingBag size={16} className="mr-2" />
                        Add to Cart
                      </button>
                      
                      <button
                        className="w-10 h-10 rounded-full border border-input flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                        aria-label="Add to wishlist"
                      >
                        <Heart size={18} />
                      </button>
                      
                      <button
                        className="w-10 h-10 rounded-full border border-input flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                        aria-label="Share product"
                      >
                        <Share size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="border-t border-border pt-8 space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Materials</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.materials.map((material, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-craft-100 rounded-full text-sm"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {product.dimensions && (
                      <div>
                        <h3 className="font-medium mb-1">Dimensions</h3>
                        <p className="text-foreground/70">{product.dimensions}</p>
                      </div>
                    )}
                    
                    {product.weight && (
                      <div>
                        <h3 className="font-medium mb-1">Weight</h3>
                        <p className="text-foreground/70">{product.weight}</p>
                      </div>
                    )}
                    
                    {product.careInstructions && (
                      <div>
                        <h3 className="font-medium mb-1">Care Instructions</h3>
                        <p className="text-foreground/70">{product.careInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Artisan Story Section */}
            {product.artisanStory && (
              <div className="mb-16 border-t border-border pt-12">
                <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4">The Artisan's Story</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-foreground/80">{product.artisanStory}</p>
                  </div>
                  <div className="bg-craft-100 p-8 rounded-lg">
                    <div className="font-medium text-lg mb-2">About {product.artisan}</div>
                    <p className="text-foreground/70 mb-4">
                      Master artisan from {product.origin}, specializing in traditional {product.category.toLowerCase()} techniques.
                    </p>
                    <Link
                      to="/about#artisans"
                      className="inline-flex items-center text-primary hover:text-primary/80 transition-colors group"
                    >
                      <span className="font-medium">Learn more about our artisans</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="border-t border-border pt-12">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="font-serif text-2xl md:text-3xl font-medium">
                    You Might Also Like
                  </h2>
                  <Link
                    to={`/products?category=${product.category}`}
                    className="text-primary hover:text-primary/80 transition-colors flex items-center"
                  >
                    <span>See all {product.category}</span>
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map(relatedProduct => (
                    <div key={relatedProduct.id} className="group">
                      <Link to={`/products/${relatedProduct.id}`} className="block">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-craft-50">
                          <img
                            src={relatedProduct.images[0]}
                            alt={relatedProduct.name}
                            className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-3">
                          <h3 className="font-medium">{relatedProduct.name}</h3>
                          <p className="text-foreground/70 text-sm">{relatedProduct.artisan}</p>
                          <p className="mt-1 font-medium">${relatedProduct.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ProductDetail;
