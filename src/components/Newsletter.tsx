
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for subscribing!",
        description: "You'll receive our newsletter with new product updates and artisan stories.",
        duration: 5000
      });
      
      setEmail('');
      setIsSubmitting(false);
    }, 800);
  };
  
  return (
    <section className="bg-craft-100 py-16 md:py-20">
      <div className="container mx-auto px-6 md:px-8 max-w-4xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-medium text-balance">
          Subscribe to Our Newsletter
        </h2>
        <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">
          Join our community to receive updates on new collections, artisan stories, and exclusive offers. We promise to only send content you'll love.
        </p>
        
        <form 
          onSubmit={handleSubmit}
          className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-md border border-craft-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary inline-flex items-center justify-center py-3 px-6 group"
          >
            <span>{isSubmitting ? "Subscribing..." : "Subscribe"}</span>
            <ArrowRight
              size={16}
              className={`ml-2 transition-transform ${isSubmitting ? "" : "group-hover:translate-x-1"}`}
            />
          </button>
        </form>
        
        <p className="mt-4 text-xs text-foreground/60">
          By subscribing, you agree to our Privacy Policy. We respect your privacy and will never share your information.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
