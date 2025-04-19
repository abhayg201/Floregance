
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import { Search, X, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, onOpenChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Filter products based on search query
  const filteredProducts = searchQuery.length > 0
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.artisan.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // Group products by category
  const groupedProducts = filteredProducts.reduce<Record<string, typeof products>>((groups, product) => {
    const category = product.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(product);
    return groups;
  }, {});

  // Handle item selection
  const handleSelect = (productId: string) => {
    onOpenChange(false);
    setSearchQuery('');
    navigate(`/products/${productId}`);
  };

  // Handle "See all results" action
  const handleSeeAllResults = () => {
    onOpenChange(false);
    setSearchQuery('');
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  // Close dialog when Escape key is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          placeholder="Search products, categories, artisans..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <CommandList>
        {searchQuery.length > 0 && filteredProducts.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          <>
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <React.Fragment key={category}>
                <CommandGroup heading={category}>
                  {categoryProducts.slice(0, 4).map((product) => (
                    <CommandItem
                      key={product.id}
                      onSelect={() => handleSelect(product.id)}
                      className="flex items-center gap-2 p-2"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-secondary">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.artisan}</span>
                      </div>
                      <div className="ml-auto font-medium">
                        ₹{product.price.toFixed(2)}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ))}
            
            {filteredProducts.length > 0 && (
              <CommandItem 
                onSelect={handleSeeAllResults}
                className="justify-center text-primary font-medium"
              >
                See all {filteredProducts.length} results
              </CommandItem>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchDialog;
