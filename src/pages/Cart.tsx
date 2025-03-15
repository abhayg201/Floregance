
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';

const Cart = () => {
  const { items, removeItem, updateQuantity, subtotal, shipping, total } = useCart();
  const { toast } = useToast();
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };
  
  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast({
      title: "Item removed",
      description: `${name} has been removed from your cart.`,
      duration: 3000
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-serif text-3xl md:text-4xl font-medium mb-6">Your Cart</h1>
            
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto bg-craft-100 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag size={32} className="text-primary" />
                </div>
                <h2 className="font-serif text-2xl mb-4">Your cart is empty</h2>
                <p className="text-foreground/70 mb-8 max-w-md mx-auto">
                  It looks like you haven't added any items to your cart yet. Browse our collection of handcrafted treasures to find something special.
                </p>
                <Link to="/products" className="btn-primary inline-flex items-center">
                  Browse Products
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <div className="border-b border-border pb-4 mb-6 hidden md:grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <span className="text-sm font-medium">Product</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-medium">Quantity</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-medium">Total</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="border-b border-border pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          <div className="md:col-span-6 flex items-center space-x-4">
                            <Link to={`/products/${item.id}`} className="shrink-0">
                              <div className="w-20 h-20 rounded-md border border-border overflow-hidden">
                                <img 
                                  src={item.images[0]} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </Link>
                            <div>
                              <Link 
                                to={`/products/${item.id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-foreground/70 mt-1">{item.artisan}</p>
                              <button
                                onClick={() => handleRemoveItem(item.id, item.name)}
                                className="text-sm text-foreground/70 hover:text-rose-500 mt-2 flex items-center"
                              >
                                <Trash2 size={14} className="mr-1" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 text-center md:text-center flex md:block items-center justify-between">
                            <span className="text-sm md:hidden font-medium">Price:</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                          
                          <div className="md:col-span-2 text-center">
                            <div className="flex items-center justify-between md:justify-center">
                              <span className="text-sm md:hidden font-medium">Quantity:</span>
                              <div className="flex items-center border border-input rounded-md">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="px-2 py-1 text-foreground/70 hover:text-foreground transition-colors disabled:opacity-50"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-1 text-foreground/70 hover:text-foreground transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 text-right flex items-center justify-between md:block">
                            <span className="text-sm md:hidden font-medium">Total:</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-craft-50 p-6 rounded-lg">
                    <h2 className="font-serif text-xl font-medium mb-4">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Shipping</span>
                        <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</span>
                      </div>
                      {shipping === 0 && (
                        <div className="text-sm text-primary">
                          Free shipping on orders over $150
                        </div>
                      )}
                      <div className="pt-3 border-t border-border flex justify-between font-medium">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Link
                      to="/checkout"
                      className="btn-primary w-full justify-center mb-4"
                    >
                      Proceed to Checkout
                    </Link>
                    
                    <Link
                      to="/products"
                      className="flex items-center justify-center text-foreground/70 hover:text-foreground"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
