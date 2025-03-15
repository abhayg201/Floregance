
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ArtisanStory = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <section className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Image */}
        <div className="relative order-2 lg:order-1 aspect-[4/5] overflow-hidden rounded-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-craft-100 animate-pulse" />
          )}
          <img 
            src="https://images.unsplash.com/photo-1627483297929-38c4788d3240?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80" 
            alt="Artisan at work"
            className={`object-cover w-full h-full transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        {/* Content */}
        <div className="order-1 lg:order-2 animate-fade-up">
          <span className="text-sm uppercase tracking-wider text-primary">Our Artisans</span>
          <h2 className="font-serif text-3xl md:text-4xl font-medium mt-2">The Hands Behind the Craft</h2>
          
          <div className="mt-6 space-y-4 text-foreground/80">
            <p>
              Behind every handcrafted piece in our collection is an artisan with decades of expertise, preserving techniques passed down through generations. These skilled craftspeople infuse each creation with cultural heritage and personal artistic vision.
            </p>
            <p>
              We work directly with these master artisans from rural communities, ensuring fair compensation that honors their exceptional skill and dedication. By choosing our products, you're supporting the continuation of these endangered crafts and the livelihoods of the artisans who create them.
            </p>
            <p>
              Each piece in our collection carries not just the marks of its maker, but a story of cultural significance and the revival of traditional craftsmanship in the modern world.
            </p>
          </div>
          
          <Link to="/about#artisans" className="btn-primary mt-8 inline-flex items-center group">
            <span>Meet Our Artisans</span>
            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArtisanStory;
