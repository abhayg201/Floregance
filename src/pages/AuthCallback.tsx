
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data.session) {
          toast.success('Successfully logged in!');
          navigate('/');
        } else {
          throw new Error('No session found');
        }
      } catch (err: any) {
        console.error('Error in auth callback:', err);
        setError(err.message || 'An error occurred during authentication');
        toast.error('Authentication failed');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-serif mb-4">Authentication Error</h1>
          <p className="text-red-500 mb-4">{error}</p>
          <p>Redirecting you to the login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <LoaderCircle className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-serif mb-2">Completing Authentication</h1>
          <p>Please wait while we log you in...</p>
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
