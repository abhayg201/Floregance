
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-craft-100 border-t border-craft-200">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-xl font-medium tracking-tight">
              Crafted Haven
            </Link>
            <p className="mt-4 text-sm text-foreground/70 leading-relaxed">
              Celebrating artisanal craftsmanship and preserving traditional techniques through beautiful, handcrafted products.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-foreground/60 hover:text-foreground transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-foreground/60 hover:text-foreground transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-foreground/60 hover:text-foreground transition-colors">
                <Twitter size={18} />
              </a>
              <a href="mailto:hello@craftedhaven.com" aria-label="Email" className="text-foreground/60 hover:text-foreground transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          {/* Navigation Columns */}
          <div>
            <h4 className="font-medium text-base mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-foreground/70 hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=home-decor" className="text-foreground/70 hover:text-foreground transition-colors">Home Decor</Link></li>
              <li><Link to="/products?category=textiles" className="text-foreground/70 hover:text-foreground transition-colors">Textiles</Link></li>
              <li><Link to="/products?category=pottery" className="text-foreground/70 hover:text-foreground transition-colors">Pottery</Link></li>
              <li><Link to="/products?category=jewelry" className="text-foreground/70 hover:text-foreground transition-colors">Jewelry</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-foreground/70 hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link to="/about#artisans" className="text-foreground/70 hover:text-foreground transition-colors">Artisans</Link></li>
              <li><Link to="/about#process" className="text-foreground/70 hover:text-foreground transition-colors">Our Process</Link></li>
              <li><Link to="/about#sustainability" className="text-foreground/70 hover:text-foreground transition-colors">Sustainability</Link></li>
              <li><Link to="/about#contact" className="text-foreground/70 hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping" className="text-foreground/70 hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="text-foreground/70 hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/privacy" className="text-foreground/70 hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-foreground/70 hover:text-foreground transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-craft-200/50 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} Crafted Haven. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Made with care and craftsmanship</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
