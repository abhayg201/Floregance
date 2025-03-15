
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  link: string;
}

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const slides: HeroSlide[] = [
    {
      id: 1,
      title: "Artisanal Craftsmanship",
      subtitle: "Handcrafted treasures that tell a story of tradition and skill",
      image: "https://images.unsplash.com/photo-1610701596541-8ef2a99ee566?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
      cta: "Explore Collection",
      link: "/products"
    },
    {
      id: 2,
      title: "Traditional Textiles",
      subtitle: "Woven with heritage techniques passed down through generations",
      image: "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
      cta: "Shop Textiles",
      link: "/products?category=textiles"
    },
    {
      id: 3,
      title: "Artisan Pottery",
      subtitle: "Each piece uniquely shaped by skilled hands and creative vision",
      image: "https://images.unsplash.com/photo-1610701596871-fa6a38ec5078?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
      cta: "Discover Pottery",
      link: "/products?category=pottery"
    }
  ];
  
  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setImageLoaded(false);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  // Preload next image
  useEffect(() => {
    const nextSlide = (currentSlide + 1) % slides.length;
    const img = new Image();
    img.src = slides[nextSlide].image;
  }, [currentSlide, slides]);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setImageLoaded(false);
  };
  
  const goToPrevSlide = () => {
    const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(newIndex);
  };
  
  const goToNextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    goToSlide(newIndex);
  };
  
  const activeSlide = slides[currentSlide];
  
  return (
    <section className="relative w-full h-screen overflow-hidden mt-16">
      {/* Background Image */}
      <div className="absolute inset-0 bg-craft-900/10">
        <img
          src={activeSlide.image}
          alt={activeSlide.title}
          className={`object-cover w-full h-full transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div className="max-w-lg md:max-w-2xl" key={activeSlide.id}>
            <div className={`transition-all duration-700 delay-200 transform ${imageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-3 py-1 bg-white/80 backdrop-blur-sm text-xs tracking-wider uppercase rounded-sm mb-4">
                Handcrafted with love
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white tracking-tight text-balance mb-4 drop-shadow-lg">
                {activeSlide.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md">
                {activeSlide.subtitle}
              </p>
              
              <Link 
                to={activeSlide.link} 
                className="btn-primary inline-flex items-center space-x-2 group"
              >
                <span>{activeSlide.cta}</span>
                <ArrowRight 
                  size={16} 
                  className="transform group-hover:translate-x-1 transition-transform" 
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-4 md:px-6">
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white border-white/30 h-12 w-12 pointer-events-auto shadow-lg"
          onClick={goToPrevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white border-white/30 h-12 w-12 pointer-events-auto shadow-lg"
          onClick={goToNextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-white scale-100' : 'bg-white/50 scale-75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
