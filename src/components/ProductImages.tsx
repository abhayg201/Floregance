
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImagesProps {
  images: string[];
  name: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const nextImage = () => {
    setImageLoaded(false);
    setSelectedImage((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setImageLoaded(false);
    setSelectedImage((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[7/5] bg-background rounded-lg overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-craft-100 animate-pulse" />
        )}
        <img
          src={images[selectedImage]}
          alt={name}
          className={`object-contain object-top w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setImageLoaded(false);
              setSelectedImage(index);
            }}
            className={cn(
              "relative aspect-[4/5] w-20 h-20 overflow-hidden rounded-md flex-shrink-0 border-2",
              selectedImage === index ? "border-primary" : "border-transparent"
            )}
          >
            <img
              src={image}
              alt={`${name} - view ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
