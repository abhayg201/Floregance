
import { signUp, signIn, signOut } from './authCore.service';
import { signInWithGoogle, signInWithFacebook } from './socialLogin.service';
import { profileService } from './profile.service';
import { phoneAuthService } from './phoneAuth.service';
import { emailVerificationService } from './emailVerification.service';
import { UserProfile, PhoneAuthResponse, EmailVerificationResponse } from './types/auth.types';

// Export everything from the individual services
export {
  signUp,
  signIn,
  signOut,
  signInWithGoogle,
  signInWithFacebook,
  profileService,
  phoneAuthService,
  emailVerificationService
};

// Re-export the getCurrentUserProfile function for backward compatibility
export const getCurrentUserProfile = profileService.getCurrentUserProfile.bind(profileService);

// Re-export the updateUserProfile function for backward compatibility
export const updateUserProfile = profileService.updateUserProfile.bind(profileService);

// Phone authentication exports for convenience
export const sendPhoneOTP = phoneAuthService.sendOTP.bind(phoneAuthService);
export const verifyPhoneOTP = phoneAuthService.verifyOTP.bind(phoneAuthService);

// Email verification exports for convenience
export const sendEmailVerification = emailVerificationService.sendVerificationEmail.bind(emailVerificationService);
export const verifyEmailOTP = emailVerificationService.verifyEmailOTP.bind(emailVerificationService);

// Re-export types
export type { UserProfile, PhoneAuthResponse, EmailVerificationResponse };
