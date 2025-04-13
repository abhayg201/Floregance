
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getOrderById } from '@/services/orderService';
import { getPaymentByOrderId } from '@/services/razorpayService';

interface LocationState {
  orderId: string;
  email: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!state || !state.orderId) {
        navigate('/');
        return;
      }
      
      try {
        const order = await getOrderById(state.orderId);
        const payment = await getPaymentByOrderId(state.orderId);
        
        if (order) {
          setOrderDetails(order);
        }
        
        if (payment) {
          setPaymentDetails(payment);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
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
            
            {loading ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="bg-craft-50 rounded-lg p-8 mb-8">
                <h2 className="font-medium text-lg mb-4">Order Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                  <div>
                    <p className="text-sm text-foreground/70">Order Number</p>
                    <p className="font-medium">{state.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Date</p>
                    <p className="font-medium">
                      {orderDetails?.created_at 
                        ? new Date(orderDetails.created_at).toLocaleDateString() 
                        : new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Email</p>
                    <p className="font-medium">{state.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Payment Method</p>
                    <p className="font-medium">Razorpay</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Order Status</p>
                    <p className="font-medium capitalize">{orderDetails?.status || "Processing"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/70">Payment Status</p>
                    <p className="font-medium capitalize">{paymentDetails?.status || "Processing"}</p>
                  </div>
                </div>
                
                {orderDetails && (
                  <div className="border-t border-border pt-4">
                    <h3 className="font-medium text-base mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {orderDetails.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-foreground/70 ml-2">x{item.quantity}</span>
                          </div>
                          <div>${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-border mt-4 pt-3 flex justify-between font-medium">
                      <span>Total</span>
                      <span>${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
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
