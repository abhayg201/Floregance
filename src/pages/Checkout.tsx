import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { createOrder } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [processingOrder, setProcessingOrder] = useState(false);
  
  // Redirect to home if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);

  // Load Razorpay script when component mounts
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Check for payment verification from URL parameters after Razorpay redirect
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const razorpayPaymentId = searchParams.get('razorpay_payment_id');
    const razorpayOrderId = searchParams.get('razorpay_order_id');
    const razorpaySignature = searchParams.get('razorpay_signature');
    
    if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      // Verify the payment
      verifyPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature);
    }
  }, [location]);

  const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    try {
      setProcessingOrder(true);
      
      const { data, error } = await supabase.functions.invoke('razorpay', {
        body: {
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
        },
        method: 'POST',
      });

      if (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Payment Verification Failed",
          description: "There was a problem verifying your payment. Please contact support.",
          duration: 5000,
        });
        return;
      }

      if (data.verified) {
        clearCart();
        navigate('/order-confirmation', { 
          state: { 
            orderId: data.orderId,
            email: formData.email
          } 
        });
        
        toast({
          title: "Payment Successful!",
          description: "Thank you for your purchase.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Payment Verification Failed",
          description: "There was a problem verifying your payment. Please contact support.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error during payment verification:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        duration: 5000,
      });
    } finally {
      setProcessingOrder(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.postalCode) errors.postalCode = 'Postal code is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form error",
        description: "Please correct the errors in the form.",
        duration: 3000,
      });
      return;
    }
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please login before placing an order.",
        duration: 3000,
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    setProcessingOrder(true);
    
    try {
      // Create order in database
      const orderData = {
        user_id: user.id,
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total,
        status: 'pending' as const,
        shipping_address: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        }
      };
      
      const orderId = await createOrder(orderData);
      
      if (!orderId) {
        throw new Error('Failed to create order');
      }

      // Create Razorpay order
      const { data, error } = await supabase.functions.invoke('razorpay', {
        body: {
          amount: total,
          orderId,
          user_id: user.id
        },
        method: 'POST',
      });

      if (error) {
        throw new Error(error.message);
      }

      if (window.Razorpay) {
        // Initialize Razorpay payment
        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: "Craft Bazaar",
          description: "Order Payment",
          order_id: data.id,
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone
          },
          notes: {
            order_id: orderId
          },
          theme: {
            color: "#693423"
          },
          handler: function() {
            // This handler will not be called on browser redirect
            // For browser redirect, use the verify payment code in useEffect
          },
          modal: {
            ondismiss: function() {
              setProcessingOrder(false);
            }
          }
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error('Razorpay SDK failed to load');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        duration: 5000,
      });
      setProcessingOrder(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-craft-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 md:p-10">
              <h1 className="font-serif text-3xl md:text-4xl font-medium mb-6">Checkout</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Information */}
                    <section>
                      <h2 className="font-serif text-xl font-medium mb-4">Contact Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                              formErrors.email ? 'border-red-500' : 'border-border'
                            }`}
                          />
                          {formErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                              formErrors.phone ? 'border-red-500' : 'border-border'
                            }`}
                            placeholder="e.g., +91XXXXXXXXXX"
                          />
                          {formErrors.phone && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                          )}
                        </div>
                      </div>
                    </section>
                    
                    {/* Shipping Address */}
                    <section>
                      <h2 className="font-serif text-xl font-medium mb-4">Shipping Address</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                              formErrors.firstName ? 'border-red-500' : 'border-border'
                            }`}
                          />
                          {formErrors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                              formErrors.lastName ? 'border-red-500' : 'border-border'
                            }`}
                          />
                          {formErrors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                              formErrors.address ? 'border-red-500' : 'border-border'
                            }`}
                          />
                          {formErrors.address && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                              formErrors.city ? 'border-red-500' : 'border-border'
                            }`}
                          />
                          {formErrors.city && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium mb-1">State/Province</label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                              formErrors.state ? 'border-red-500' : 'border-border'
                            }`}
                          />
                          {formErrors.state && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                              formErrors.postalCode ? 'border-red-500' : 'border-border'
                            }`}
                          />
                          {formErrors.postalCode && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                      </div>
                    </section>
                    
                    {/* Payment Information Section - Replaced with Razorpay */}
                    <section>
                      <h2 className="font-serif text-xl font-medium mb-4">Payment Information</h2>
                      <div className="border border-border rounded-md p-6">
                        <div className="flex items-center mb-6">
                          <CreditCard size={20} className="text-primary mr-2" />
                          <span className="font-medium">Secure Payment with Razorpay</span>
                        </div>
                        
                        <p className="text-sm text-foreground/70 mb-4">
                          After you proceed, you'll be redirected to Razorpay's secure payment gateway to complete your payment.
                        </p>
                        
                        <div className="bg-primary/10 p-4 rounded-md">
                          <div className="flex items-start">
                            <div className="mr-3">
                              <Check size={18} className="text-primary mt-0.5" />
                            </div>
                            <div>
                              <p className="text-sm">All payment information is securely handled by Razorpay. We never store your card details.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-6">
                      <Link
                        to="/cart"
                        className="flex items-center text-foreground/70 hover:text-foreground mb-4 sm:mb-0"
                      >
                        <ArrowLeft size={16} className="mr-2" />
                        Return to Cart
                      </Link>
                      
                      <button
                        type="submit"
                        className="btn-primary min-w-[200px] justify-center"
                        disabled={processingOrder}
                      >
                        {processingOrder ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          <span>Proceed to Payment</span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-craft-50 p-6 rounded-lg">
                    <h2 className="font-serif text-xl font-medium mb-4">Order Summary</h2>
                    
                    <div className="mb-6">
                      <div className="max-h-60 overflow-y-auto space-y-4 mb-6">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-md border border-border overflow-hidden flex-shrink-0">
                              <img 
                                src={item.images[0]} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-foreground/70">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t border-border">
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
                    </div>
                    
                    <div className="bg-white p-4 rounded-md border border-border">
                      <div className="flex items-start">
                        <div className="bg-primary/10 rounded-full p-1 mr-3 mt-0.5">
                          <Check size={16} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Secure Checkout</p>
                          <p className="text-xs text-foreground/70 mt-1">
                            Your payment information is processed securely by Razorpay.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
