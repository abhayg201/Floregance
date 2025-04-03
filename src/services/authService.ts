
import { signUp, signIn, signOut } from './authCore.service';
import { signInWithGoogle, signInWithFacebook } from './socialLogin.service';
import { profileService } from './profile.service';
import { UserProfile } from './types/auth.types';

// Export everything from the individual services
export {
  signUp,
  signIn,
  signOut,
  signInWithGoogle,
  signInWithFacebook,
  profileService
};

// Re-export the getCurrentUserProfile function for backward compatibility
export const getCurrentUserProfile = profileService.getCurrentUserProfile.bind(profileService);

// Re-export the updateUserProfile function for backward compatibility
export const updateUserProfile = profileService.updateUserProfile.bind(profileService);

// Re-export the UserProfile type
export type { UserProfile };
