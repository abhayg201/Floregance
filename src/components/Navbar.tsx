
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProfileButton from './ProfileButton';
import SearchDialog from './SearchDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { items } = useCart();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: 'Artisans', href: '/about#artisans' },
    { title: 'Our Story', href: '/about' },
    { title: 'Contact', href: '/about#contact' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out-sine",
        isScrolled 
          ? "py-3 bg-white/80 backdrop-blur-md shadow-sm" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="font-serif text-xl md:text-2xl font-medium tracking-tight mr-auto"
        >
          Floregance
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 mx-auto">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.title}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1.5" 
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search size={isMobile ? 18 : 20} />
            <span className="hidden md:inline text-sm">Search</span>
          </button>
          
          <Link 
            to="/cart" 
            className="text-foreground/70 hover:text-foreground transition-colors relative"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={isMobile ? 18 : 20} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-scale-up">
                {items.length}
              </span>
            )}
          </Link>
          
          <ProfileButton />
          
          <button 
            className="md:hidden text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 transition-transform transform duration-300 ease-out-sine pt-20",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container mx-auto px-6 py-8 flex flex-col space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              className="text-lg font-medium py-2 border-b border-border/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.title}
            </Link>
          ))}
          <button 
            className="text-lg font-medium py-2 border-b border-border/50 text-left flex items-center gap-2"
            onClick={() => {
              setMobileMenuOpen(false);
              setSearchOpen(true);
            }}
          >
            <Search size={18} />
            Search
          </button>
        </nav>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Navbar;
