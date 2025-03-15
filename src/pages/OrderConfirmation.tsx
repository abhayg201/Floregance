
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LocationState {
  orderId: string;
  email: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  
  // Redirect to home if no order info is available
  useEffect(() => {
    if (!state || !state.orderId) {
      navigate('/');
    }
  }, [state, navigate]);
  
  if (!state || !state.orderId) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle size={40} className="text-primary" />
              </div>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl font-medium mb-3">Thank You for Your Order!</h1>
            <p className="text-foreground/70 mb-8">
              Your order has been received and is being processed. You will receive a confirmation 
              email shortly at {state.email}.
            </p>
            
            <div className="bg-craft-50 rounded-lg p-8 mb-8">
              <h2 className="font-medium text-lg mb-4">Order Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-foreground/70">Order Number</p>
                  <p className="font-medium">{state.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Email</p>
                  <p className="font-medium">{state.email}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Payment Method</p>
                  <p className="font-medium">Credit Card</p>
                </div>
              </div>
            </div>
            
            <p className="mb-6">
              We'll notify you when your order ships. If you have any questions or concerns, 
              please contact our customer service team.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/" className="btn-primary inline-flex items-center">
                Continue Shopping
                <ArrowRight size={16} className="ml-2" />
              </Link>
              
              <Link 
                to="/products" 
                className="inline-flex items-center text-foreground/70 hover:text-foreground"
              >
                <ShoppingBag size={16} className="mr-2" />
                Browse More Products
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
