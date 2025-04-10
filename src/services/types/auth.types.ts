
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  avatar?: string; // For backward compatibility
  provider?: string; // Provider field
  phone_number?: string; // Added for phone authentication
  email_confirmed?: boolean; // Track email confirmation status
  phone_confirmed?: boolean; // Track phone confirmation status
}

export interface AuthError {
  message: string;
  code?: string;
}

export interface PhoneAuthResponse {
  success: boolean;
  message: string;
  otpSent?: boolean;
  verified?: boolean;
}

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}
