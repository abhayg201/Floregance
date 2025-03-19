
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  avatar?: string; // Adding this for backward compatibility
  provider?: string; // Adding provider field
}

// Sign up a new user
export const signUp = async (email: string, password: string, name: string) => {
  try {
    console.log('Attempting to sign up user:', email);
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
      throw error;
    }

    console.log('Sign up successful, user data:', data);

    // Create a profile record for the user
    if (data?.user) {
      const profileData = {
        id: data.user.id,
        email: data.user.email,
        name,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      console.log('Creating profile for user:', profileData);
      
      const { error: profileError } = await supabase.from('profiles').insert(profileData);
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
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

// Get the current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  try {
    console.log('Fetching current user profile');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error when fetching user:', authError);
      return null;
    }
    
    if (!authData.user) {
      console.log('No user found');
      return null;
    }
    
    console.log('User found, fetching profile from profiles table');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If the profile doesn't exist yet (e.g., for OAuth users), create one
      if (error.code === 'PGRST116') {
        console.log('Profile not found, attempting to create one');
        const newProfile = {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata?.name || authData.user.email?.split('@')[0] || 'User',
          avatar_url: authData.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.email}`,
        };
        
        const { error: insertError } = await supabase.from('profiles').insert(newProfile);
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          return null;
        }
        
        // Add provider information
        return {
          ...newProfile,
          avatar: newProfile.avatar_url,
          provider: authData.user.app_metadata?.provider || 'email'
        } as UserProfile;
      }
      
      return null;
    }
    
    // Add provider information and make sure avatar is accessible via both avatar and avatar_url
    const userProfile = {
      ...data,
      avatar: data.avatar_url, // For backward compatibility
      provider: authData.user.app_metadata?.provider || 'email'
    } as UserProfile;
    
    console.log('User profile fetched successfully:', userProfile);
    return userProfile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (id: string, updates: Partial<UserProfile>) => {
  try {
    console.log('Updating user profile:', id, updates);
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully');
    toast.success('Profile updated successfully');
  } catch (error: any) {
    console.error('Profile update service error:', error);
    toast.error(error.message || 'Error updating profile');
    throw error;
  }
};
