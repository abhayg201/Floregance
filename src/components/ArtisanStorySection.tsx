
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ArtisanStorySectionProps {
  artisanStory: string;
  artisan: string;
  origin: string;
  category: string;
}

const ArtisanStorySection: React.FC<ArtisanStorySectionProps> = ({
  artisanStory,
  artisan,
  origin,
  category
}) => {
  if (!artisanStory) return null;

  return (
    <div className="mb-16 border-t border-border pt-12">
      <h2 className="font-serif text-2xl md:text-3xl font-medium mb-4">The Artisan's Story</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-foreground/80">{artisanStory}</p>
        </div>
        <div className="bg-craft-100 p-8 rounded-lg">
          <div className="font-medium text-lg mb-2">About {artisan}</div>
          <p className="text-foreground/70 mb-4">
            Master artisan from {origin}, specializing in traditional {category.toLowerCase()} techniques.
          </p>
          <Link
            to="/about#artisans"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors group"
          >
            <span className="font-medium">Learn more about our artisans</span>
            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArtisanStorySection;
