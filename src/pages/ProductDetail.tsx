
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { products } from '@/data/products';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import SEO from '@/components/SEO';
import ProductImages from '@/components/ProductImages';
import ProductInfo from '@/components/ProductInfo';
import RelatedProducts from '@/components/RelatedProducts';
import { Product } from '@/types/product';
import { getProductById } from '@/services/productService';
import ArtisanStorySection from '@/components/ArtisanStorySection';
import NotFound from './NotFound';
import LoadingPage from '@/components/LoadingPage';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const product = products.find(p => p.id === id);
  
  // useEffect(() => {
  //   if (!product) {
  //     navigate('/products');
  //   }
  // }, [product, navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Replace with your actual API call
        // const response = await fetch(`/api/products/${id}`);
        const data = await getProductById(id);
        console.log(data);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !product) {
    return (
      <NotFound />
    );
  }

  // Product schema for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images[0],
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Floregance"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "availability": "https://schema.org/InStock"
    }
  };
  
  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={`${product.name} | Floregance`}
        description={product.description.substring(0, 160)}
        image={product.images[0]}
        canonicalUrl={`/products/${product.id}`}
        type="product"
        schema={productSchema}
      />
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="flex items-center text-sm text-foreground/60">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={12} className="mx-2" />
              <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
              <ChevronRight size={12} className="mx-2" />
              <Link to={`/products?category=${product.category}`} className="hover:text-foreground transition-colors">
                {product.category}
              </Link>
              <ChevronRight size={12} className="mx-2" />
              <span className="text-foreground">{product.name}</span>
            </nav>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
              <ProductImages images={product.images} name={product.name} />
              <ProductInfo product={product} />
            </div>
            
            <ArtisanStorySection
              origin={''}
              category={product.category} 
              artisanStory={''} artisan={''} />
            
            <RelatedProducts products={relatedProducts} category={product.category} />
          </div>
        </div>
      </main>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ProductDetail;
