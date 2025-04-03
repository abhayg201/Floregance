
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
  try {
    console.log('Attempting Google sign in');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Google sign in error:', error);
      throw error;
    }

    console.log('Google sign in initiated, data:', data);
    return data;
  } catch (error: any) {
    console.error('Google sign in service error:', error);
    toast.error(error.message || 'Error signing in with Google');
    throw error;
  }
};

// Sign in with Facebook OAuth
export const signInWithFacebook = async () => {
  try {
    console.log('Attempting Facebook sign in');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Facebook sign in error:', error);
      throw error;
    }

    console.log('Facebook sign in initiated, data:', data);
    return data;
  } catch (error: any) {
    console.error('Facebook sign in service error:', error);
    toast.error(error.message || 'Error signing in with Facebook');
    throw error;
  }
};
