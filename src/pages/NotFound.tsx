import { Home } from "lucide-react";
import { Link } from "react-router-dom";

interface NotFoundProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}
const NotFound = ({ 
  title = "Oops! Product Not Found", 
  message = "We couldn't find the product you're looking for. It might have been removed or is no longer available.",
  showHomeButton = true 
}: NotFoundProps) => {

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <img 
            src="https://dlolhcrygcthnhpwrhcr.supabase.co/storage/v1/object/sign/products/404%20error%20page/404.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwcm9kdWN0cy80MDQgZXJyb3IgcGFnZS80MDQuanBnIiwiaWF0IjoxNzQ1NzUwMjc3LCJleHAiOjE3NzcyODYyNzd9.LwpDu2CrI5OPXdANcggioYStw4MYbEhh-gmZLH7JBR0" 
            alt="Not Found" 
            className="mx-auto"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {title}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          {message}
        </p>

        {showHomeButton && (
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5 mr-2 mb-0.5" />
            Back to Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default NotFound;
