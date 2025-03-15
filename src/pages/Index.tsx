
import React from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import ArtisanStory from '@/components/ArtisanStory';
import Newsletter from '@/components/Newsletter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <div className="bg-craft-50 pt-16 pb-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
                <h3 className="font-serif text-xl font-medium mb-3">Artisanal Craftsmanship</h3>
                <p className="text-foreground/70">Each piece in our collection is meticulously handcrafted by skilled artisans using traditional techniques.</p>
              </div>
              
              <div className="p-6 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <h3 className="font-serif text-xl font-medium mb-3">Ethically Sourced</h3>
                <p className="text-foreground/70">We work directly with artisans to ensure fair compensation and sustainable practices that honor their communities.</p>
              </div>
              
              <div className="p-6 animate-fade-up" style={{ animationDelay: "300ms" }}>
                <h3 className="font-serif text-xl font-medium mb-3">Cultural Heritage</h3>
                <p className="text-foreground/70">Our products celebrate the rich cultural heritage and traditional techniques of artisan communities worldwide.</p>
              </div>
            </div>
          </div>
        </div>
        
        <FeaturedProducts />
        
        <div className="bg-craft-50 py-20">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">Our Commitment to Craft</h2>
            <p className="text-foreground/80 mb-10 text-lg">
              At Crafted Haven, we believe in the power of handcrafted items to connect us to culture, tradition, and the human touch. Our mission is to preserve traditional crafting techniques by creating a marketplace where artisans can thrive and consumers can discover unique pieces with authentic stories.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 text-center">
              <div>
                <p className="font-serif text-3xl font-medium text-primary">300+</p>
                <p className="text-sm text-foreground/70 mt-1">Artisan Partners</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-medium text-primary">25</p>
                <p className="text-sm text-foreground/70 mt-1">Countries</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-medium text-primary">5,000+</p>
                <p className="text-sm text-foreground/70 mt-1">Unique Products</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-medium text-primary">15+</p>
                <p className="text-sm text-foreground/70 mt-1">Craft Techniques</p>
              </div>
            </div>
          </div>
        </div>
        
        <ArtisanStory />
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
