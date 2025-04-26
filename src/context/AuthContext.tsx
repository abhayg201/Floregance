import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { profileService } from '@/services/profile.service';
import { 
  signUp as apiSignUp, 
  signIn as apiSignIn, 
  signInWithGoogle as apiSignInWithGoogle,
  signInWithFacebook as apiSignInWithFacebook,
  signOut as apiSignOut,
  getCurrentUserProfile,
  sendPhoneOTP as apiSendPhoneOTP,
  verifyPhoneOTP as apiVerifyPhoneOTP,
  sendEmailVerification as apiSendEmailVerification,
  verifyEmailOTP as apiVerifyEmailOTP,
  UserProfile,
  PhoneAuthResponse,
  EmailVerificationResponse
} from '@/services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSocialLoginLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ provider: string; url: string | null }>;
  sendEmailVerificationCode: (email: string) => Promise<EmailVerificationResponse>;
  verifyEmail: (email: string, otp: string) => Promise<EmailVerificationResponse>;
  logout: () => Promise<void>;
  setIsSocialLoginLoading: (isLoading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSocialLoginLoading, setIsSocialLoginLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Then check for an existing session
    const checkUser = async () => {
      try { 
        console.log('Initial check for logged in user');
        setIsLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          console.log('Session exists, fetching user profile');
          const userProfile = await profileService.getCurrentUserProfile();
          console.log('Initial user profile:', userProfile);
          setUser(userProfile);
          setIsAuthenticated(true);
        } else {
          console.log('No active session found');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    setIsLoading(true);
    try {
      await apiSignIn(email, password);
      console.log('Login successful');
      
      // Get the session after successful login
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userProfile = await getCurrentUserProfile();
        setUser(userProfile);
        setIsAuthenticated(true);
        console.log('Auth state updated with user:', userProfile);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('Register attempt for:', email);
    setIsLoading(true);
    try {
      await apiSignUp(email, password, name);
      console.log('Registration successful, logging in');
      await apiSignIn(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    console.log('Google login attempt');
    setIsSocialLoginLoading(true);
    try {
      const response = await apiSignInWithGoogle();
      console.log('Google login redirect initiated');
      return response;
    } catch (error) {
      console.error('Google login error:', error);
      setIsSocialLoginLoading(false);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    console.log('Facebook login attempt');
    setIsSocialLoginLoading(true);
    try {
      const response = await apiSignInWithFacebook();
      console.log('Facebook login redirect initiated');
      return response;
    } catch (error) {
      console.error('Facebook login error:', error);
      setIsSocialLoginLoading(false);
      throw error;
    }
  };
  
  const loginWithPhone = async (phoneNumber: string): Promise<PhoneAuthResponse> => {
    console.log('Phone login attempt:', phoneNumber);
    setIsLoading(true);
    try {
      const response = await apiSendPhoneOTP(phoneNumber);
      return response;
    } catch (error: any) {
      console.error('Phone login error:', error);
      return { success: false, message: error.message || 'Error sending OTP' };
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyPhone = async (phoneNumber: string, otp: string): Promise<PhoneAuthResponse> => {
    console.log('Phone verification attempt:', phoneNumber);
    setIsLoading(true);
    try {
      const response = await apiVerifyPhoneOTP(phoneNumber, otp);
      return response;
    } catch (error: any) {
      console.error('Phone verification error:', error);
      return { success: false, message: error.message || 'Error verifying OTP' };
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendEmailVerificationCode = async (email: string): Promise<EmailVerificationResponse> => {
    console.log('Email verification code request for:', email);
    setIsLoading(true);
    try {
      const response = await apiSendEmailVerification(email);
      return response;
    } catch (error: any) {
      console.error('Email verification code error:', error);
      return { success: false, message: error.message || 'Error sending verification code' };
    } finally {
      setIsLoading(false);
    }
  };
  
  const verifyEmail = async (email: string, otp: string): Promise<EmailVerificationResponse> => {
    console.log('Email verification attempt for:', email);
    setIsLoading(true);
    try {
      const response = await apiVerifyEmailOTP(email, otp);
      return response;
    } catch (error: any) {
      console.error('Email verification error:', error);
      return { success: false, message: error.message || 'Error verifying email' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear any stored tokens or session data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      // Reset auth state
      setUser(null);
      setIsAuthenticated(false);
      // Clear any other relevant state
      // ... any other state cleanup ...
      
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isSocialLoginLoading,
        login,
        register,
        loginWithGoogle,
        sendEmailVerificationCode,
        verifyEmail,
        logout,
        setIsSocialLoginLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
