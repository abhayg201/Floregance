
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductImagesProps {
  images: string[];
  name: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] bg-craft-50 rounded-lg overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-craft-100 animate-pulse" />
        )}
        <img
          src={images[selectedImage]}
          alt={name}
          className={`object-cover w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedImage(index);
              setImageLoaded(false);
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
