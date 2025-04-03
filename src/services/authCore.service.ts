
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from './types/auth.types';
import { profileService } from './profile.service';

// Sign up a new user
export const signUp = async (email: string, password: string, name: string) => {
  try {
    console.log('Attempting to sign up user:', email);
    
    // Proceed with signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error);
      
      // Special handling for email_not_confirmed error
      if (error.code === 'email_not_confirmed') {
        // Try to sign in with credentials when this happens
        console.log('Email not confirmed, trying to sign in directly...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('Sign in attempt after email_not_confirmed error failed:', signInError);
          throw new Error('This email is already registered but not confirmed. Please check your inbox for a confirmation email or try to sign in instead.');
        }
        
        return signInData;
      }
      
      throw error;
    }

    console.log('Sign up successful, user data:', data);

    // Create a profile record for the user
    if (data?.user) {
      await profileService.createProfile(data.user.id, email, name);
    }

    return data;
  } catch (error: any) {
    console.error('Sign up service error:', error);
    toast.error(error.message || 'Error during sign up');
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    console.log('Sign in successful, data:', data);
    return data;
  } catch (error: any) {
    console.error('Sign in service error:', error);
    toast.error(error.message || 'Error during sign in');
    throw error;
  }
};

// Sign out the current user
export const signOut = async () => {
  try {
    console.log('Attempting sign out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    console.log('Sign out successful');
  } catch (error: any) {
    console.error('Sign out service error:', error);
    toast.error(error.message || 'Error signing out');
    throw error;
  }
};
