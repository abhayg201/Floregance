import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserProfile } from './types/auth.types';

class ProfileService {
  // Create a profile for a new user
  async createProfile(
    userId: string,
    email: string,
    name: string
  ): Promise<void> {
    const profileData = {
      id: userId,
      email,
      name,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    console.log('Creating profile for user:', profileData);

    const { error: profileError } = await supabase
      .from('profiles')
      .insert(profileData);

    if (profileError) {
      console.error('Error creating profile:', profileError);
    }
  }

  // Get the current user profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      console.log('Fetching current user profile');
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      console.log('Auth data:', authData);

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
            name:
              authData.user.user_metadata?.name ||
              authData.user.email?.split('@')[0] ||
              'User',
            avatar_url:
              authData.user.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.user.email}`,
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            return null;
          }

          // Update last login time for the new profile
          await supabase
            .from('profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', authData.user.id);

          // Add provider information
          return {
            ...newProfile,
            avatar: newProfile.avatar_url,
            provider: authData.user.app_metadata?.provider || 'email',
          } as UserProfile;
        }

        return null;
      }

      // Add provider information and make sure avatar is accessible via both avatar and avatar_url
      const userProfile = {
        ...data,
        avatar: data.avatar_url, // For backward compatibility
        provider: authData.user.app_metadata?.provider || 'email',
      } as UserProfile;

      console.log('User profile fetched successfully:', userProfile);
      return userProfile;
    } catch (error) {
      console.error('Error in getCurrentUserProfile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(id: string, updates: Partial<UserProfile>) {
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
  }
}

export const profileService = new ProfileService();
