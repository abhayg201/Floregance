
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

// Sign up a new user
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;

    // Create a profile record for the user
    if (data?.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      });
    }

    return data;
  } catch (error: any) {
    toast.error(error.message || 'Error during sign up');
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Error during sign in');
    throw error;
  }
};

// Sign in with Google OAuth
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Error signing in with Google');
    throw error;
  }
};

// Sign in with Facebook OAuth
export const signInWithFacebook = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Error signing in with Facebook');
    throw error;
  }
};

// Sign out the current user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    toast.error(error.message || 'Error signing out');
    throw error;
  }
};

// Get the current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: authData } = await supabase.auth.getUser();
    
    if (!authData.user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (error) throw error;
    
    return data as UserProfile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (id: string, updates: Partial<UserProfile>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Profile updated successfully');
  } catch (error: any) {
    toast.error(error.message || 'Error updating profile');
    throw error;
  }
};
