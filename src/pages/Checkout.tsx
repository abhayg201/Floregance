
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, CreditCard, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';

const Checkout = () => {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
    cardNumber: '',
    cardName: '',
    expiration: '',
    cvv: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [processingOrder, setProcessingOrder] = useState(false);
  
  // Redirect to home if cart is empty
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('/');
    }
  }, [items, navigate]);
  
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
    if (!formData.cardNumber) errors.cardNumber = 'Card number is required';
    if (!formData.cardName) errors.cardName = 'Name on card is required';
    if (!formData.expiration) errors.expiration = 'Expiration date is required';
    if (!formData.cvv) errors.cvv = 'CVV is required';
    
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
    
    setProcessingOrder(true);
    
    // Simulate order processing
    setTimeout(() => {
      clearCart();
      navigate('/order-confirmation', { 
        state: { 
          orderId: Math.floor(1000000 + Math.random() * 9000000).toString(),
          email: formData.email
        } 
      });
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
        duration: 5000,
      });
      
      setProcessingOrder(false);
    }, 2000);
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
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone (optional)</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </section>
                    
                    {/* Payment Information */}
                    <section>
                      <h2 className="font-serif text-xl font-medium mb-4">Payment Information</h2>
                      <div className="border border-border rounded-md p-6">
                        <div className="flex items-center mb-6">
                          <CreditCard size={20} className="text-primary mr-2" />
                          <span className="font-medium">Credit Card</span>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">Card Number</label>
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                                formErrors.cardNumber ? 'border-red-500' : 'border-border'
                              }`}
                            />
                            {formErrors.cardNumber && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="cardName" className="block text-sm font-medium mb-1">Name on Card</label>
                            <input
                              type="text"
                              id="cardName"
                              name="cardName"
                              value={formData.cardName}
                              onChange={handleChange}
                              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                                formErrors.cardName ? 'border-red-500' : 'border-border'
                              }`}
                            />
                            {formErrors.cardName && (
                              <p className="text-red-500 text-sm mt-1">{formErrors.cardName}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="expiration" className="block text-sm font-medium mb-1">Expiration (MM/YY)</label>
                              <input
                                type="text"
                                id="expiration"
                                name="expiration"
                                placeholder="MM/YY"
                                value={formData.expiration}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                                  formErrors.expiration ? 'border-red-500' : 'border-border'
                                }`}
                              />
                              {formErrors.expiration && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.expiration}</p>
                              )}
                            </div>
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium mb-1">CVV</label>
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                placeholder="123"
                                value={formData.cvv}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
                                  formErrors.cvv ? 'border-red-500' : 'border-border'
                                }`}
                              />
                              {formErrors.cvv && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>
                              )}
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
                          <span>Complete Order</span>
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
                            Your payment information is processed securely.
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
