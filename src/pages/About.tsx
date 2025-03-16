
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Mail, MapPin, Phone } from 'lucide-react';

const About = () => {
  const location = useLocation();
  const artisansRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const sustainabilityRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle hash navigation
    if (location.hash) {
      const targetRef = {
        '#artisans': artisansRef,
        '#process': processRef,
        '#sustainability': sustainabilityRef,
        '#contact': contactRef
      }[location.hash];

      if (targetRef && targetRef.current) {
        setTimeout(() => {
          window.scrollTo({
            top: targetRef.current!.offsetTop - 100,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
              alt="Artisans at work" 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="container relative z-10 text-center text-white">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-4">Our Story</h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/90">
              Celebrating craftsmanship, tradition, and sustainable living through artisanal creations.
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="section-container my-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-3xl md:text-4xl font-medium mb-6">Our Mission</h2>
              <div className="space-y-4 text-foreground/80">
                <p>
                  Crafted Haven was born from a deep appreciation for traditional craftsmanship and a desire to connect modern consumers with the rich heritage of artisanal creation. Our journey began when our founder, Elena, traveled through rural communities across the globe and witnessed firsthand the incredible skill and creativity of local artisans.
                </p>
                <p>
                  What started as a personal passion project has grown into a platform that showcases exceptional handmade goods while ensuring the artisans behind them receive fair compensation and recognition for their work. We believe that beautiful, thoughtfully made items should not only enhance our living spaces but also tell meaningful stories and support sustainable practices.
                </p>
                <p>
                  Each piece in our collection represents hours of dedicated craftsmanship, cultural heritage, and techniques passed down through generations. We're committed to preserving these traditions while helping them evolve to meet contemporary needs and aesthetics.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 aspect-[4/5] overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1590422749897-47036da0b0ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80" 
                alt="Artisan pottery" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="bg-craft-50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-center mb-12">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-xl font-medium mb-4">Authenticity</h3>
                <p className="text-foreground/80">
                  We celebrate genuine craftsmanship and the unique character that comes from items made by human hands. Each piece tells a story of its maker and cultural origins.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-xl font-medium mb-4">Sustainability</h3>
                <p className="text-foreground/80">
                  We're committed to environmentally responsible practices, from sourcing natural materials to minimizing waste and supporting traditional techniques that have a lower environmental impact.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-xl font-medium mb-4">Fair Trade</h3>
                <p className="text-foreground/80">
                  We ensure our artisan partners receive fair compensation for their work, helping to sustain their livelihoods and communities while preserving valuable cultural heritage.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Artisans Section */}
        <section ref={artisansRef} id="artisans" className="section-container my-16">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-center mb-12">Meet Our Artisans</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Artisan 1 */}
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1559703248-dcaaec9fab78?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80" 
                  alt="Maria, master weaver" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl font-medium">Maria Hernandez</h3>
              <p className="text-primary font-medium mb-2">Master Weaver, Mexico</p>
              <p className="text-foreground/80">
                With over 40 years of experience, Maria's intricate textile work preserves patterns and techniques dating back centuries in her indigenous community.
              </p>
            </div>
            
            {/* Artisan 2 */}
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80" 
                  alt="Raj, master potter" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl font-medium">Raj Patel</h3>
              <p className="text-primary font-medium mb-2">Master Potter, India</p>
              <p className="text-foreground/80">
                Raj's family has been creating hand-thrown pottery for seven generations, using traditional techniques and local clay to craft both functional and decorative pieces.
              </p>
            </div>
            
            {/* Artisan 3 */}
            <div className="group">
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1542057222-95dd1d6dff99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80" 
                  alt="Amara, jewelry maker" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl font-medium">Amara Okafor</h3>
              <p className="text-primary font-medium mb-2">Jewelry Artisan, Ghana</p>
              <p className="text-foreground/80">
                Combining traditional West African metalworking techniques with contemporary design, Amara creates stunning jewelry pieces that honor her heritage.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Process Section */}
        <section ref={processRef} id="process" className="bg-craft-100 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-center mb-12">Our Process</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80" 
                  alt="Artisan workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-medium">1. Discovery</h3>
                  <p className="text-foreground/80">
                    We travel to remote villages and urban workshops alike, seeking out exceptional artisans who maintain traditional techniques while bringing fresh perspectives to their craft.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-medium">2. Collaboration</h3>
                  <p className="text-foreground/80">
                    We work closely with artisans to develop products that honor their traditional methods while appealing to contemporary tastes and needs.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-medium">3. Creation</h3>
                  <p className="text-foreground/80">
                    Each piece is handcrafted with care, often taking days or weeks to complete. We respect the artisan's process and never rush production for quantity over quality.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-medium">4. Connection</h3>
                  <p className="text-foreground/80">
                    We bring these treasures to you, along with the stories of their makers. When you purchase from Crafted Haven, you're not just buying an object; you're connecting with a person and their cultural heritage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sustainability Section */}
        <section ref={sustainabilityRef} id="sustainability" className="section-container my-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-medium">Our Commitment to Sustainability</h2>
              
              <div className="space-y-4 text-foreground/80">
                <p>
                  Sustainability isn't just a trend for us—it's woven into the very fabric of what we do. Traditional crafts often use natural materials, minimal machinery, and techniques that have stood the test of time precisely because they work harmoniously with the environment.
                </p>
                <p>
                  We're proud that many of our products:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use natural, biodegradable materials sourced locally to the artisan</li>
                  <li>Feature natural dyes derived from plants, minerals, and other sustainable sources</li>
                  <li>Require minimal electricity in their production</li>
                  <li>Generate less waste through made-to-order processes and the use of scraps in new creations</li>
                  <li>Travel shorter distances due to our direct relationships with makers</li>
                </ul>
                <p>
                  By choosing handcrafted items that are built to last, you're also making a more sustainable choice—investing in quality over quantity and reducing the cycle of disposable consumption.
                </p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 aspect-[4/5] overflow-hidden rounded-lg">
              <img 
                src="https://images.unsplash.com/photo-1621113911250-ae8c9c40d84f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80" 
                alt="Natural dyeing process" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section ref={contactRef} id="contact" className="bg-craft-50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-center mb-12">Get in Touch</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="font-serif text-xl font-medium mb-6">Send Us a Message</h3>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Name</label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input id="email" type="email" placeholder="Your email" required />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input id="subject" placeholder="What's this about?" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help..." 
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif text-xl font-medium mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Our Address</h4>
                        <p className="text-foreground/80">
                          123 Artisan Way<br />
                          Craftsville, CA 94105<br />
                          United States
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Email Us</h4>
                        <p className="text-foreground/80">
                          hello@craftedhaven.com<br />
                          support@craftedhaven.com
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Call Us</h4>
                        <p className="text-foreground/80">
                          +1 (555) 123-4567<br />
                          Monday-Friday: 9am-5pm PST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-serif text-xl font-medium mb-4">Visit Our Shop</h3>
                  <p className="text-foreground/80 mb-4">
                    We have a physical location where you can see and touch our products in person:
                  </p>
                  <div className="aspect-[16/9] overflow-hidden rounded-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1604328698692-f76ea9498e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1800&q=80" 
                      alt="Crafted Haven storefront" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-sm text-foreground/70">
                    Open Tuesday-Sunday, 10am-6pm PST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
