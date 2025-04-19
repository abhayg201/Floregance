
import React, { useState } from 'react';
import { ShoppingBag, Heart, Share, Plus, Minus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
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

  return (
    <div className="flex flex-col">
      <h1 className="font-serif text-3xl md:text-4xl font-medium mb-2">{product.name}</h1>
      <p className="text-foreground/70 mb-3">By {product.artisan} from {product.origin}</p>
      
      <div className="flex items-baseline mb-6">
        <span className="text-2xl font-medium">
          ₹{product.price.toLocaleString()}
        </span>
        {product.originalPrice && (
          <span className="ml-3 text-foreground/60 line-through">
            ₹{product.originalPrice.toLocaleString()}
          </span>
        )}
      </div>
      
      <p className="text-foreground/80 mb-8">{product.description}</p>
      
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
  );
};

export default ProductInfo;
