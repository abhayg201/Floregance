
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Eye, ShoppingBag, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000
    });
  };
  
  return (
    <div 
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block h-full">
        <Link to={`/products/${product.id}`} className="block">
          <div className="relative overflow-hidden rounded-md bg-craft-50">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-craft-100 animate-pulse" />
            )}
            <img
              src={product.images[0]}
              alt={product.name}
              className={cn(
                "product-image transition-all duration-500",
                isHovered ? "scale-105" : "scale-100",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Quick actions overlay */}
            <div className={cn(
              "absolute inset-0 bg-black/0 transition-all duration-300 flex items-center justify-center gap-2",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <div className="flex gap-2 transform transition-all duration-300 delay-75"
                   style={{ transform: isHovered ? 'translateY(0)' : 'translateY(20px)' }}>
                <button
                  onClick={handleAddToCart}
                  className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:bg-primary hover:text-white"
                  aria-label="Add to cart"
                >
                  <ShoppingBag size={18} />
                </button>
                <Link
                  to={`/products/${product.id}`}
                  className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:bg-primary hover:text-white"
                  aria-label="View details"
                >
                  <Eye size={18} />
                </Link>
                <button
                  className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all hover:bg-primary hover:text-white"
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-2 py-1 text-xs bg-white/80 backdrop-blur-sm rounded text-foreground/80">
            {product.category}
          </span>
        </div>
        
        {/* Product details */}
        <Link to={`/products/${product.id}`}>
          <div className="mt-4 space-y-1">
            <h3 className="font-medium text-foreground">{product.name}</h3>
            <p className="text-sm text-foreground/70">{product.artisan}</p>
            <div className="flex items-baseline justify-between mt-1">
              <p className="font-medium">
                ${product.price.toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-foreground/60 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
