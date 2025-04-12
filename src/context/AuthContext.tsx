import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  loginWithFacebook: () => Promise<{ provider: string; url: string | null }>;
  loginWithPhone: (phoneNumber: string) => Promise<PhoneAuthResponse>;
  verifyPhone: (phoneNumber: string, otp: string) => Promise<PhoneAuthResponse>;
  sendEmailVerificationCode: (email: string) => Promise<EmailVerificationResponse>;
  verifyEmail: (email: string, otp: string) => Promise<EmailVerificationResponse>;
  logout: () => Promise<void>;
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

  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
        setIsLoading(true);
        
        if (session?.user) {
          console.log('Session user exists, fetching profile');
          try {
            const userProfile = await getCurrentUserProfile();
            console.log('User profile fetched:', userProfile);
            setUser(userProfile);
          } catch (error) {
            console.error('Error getting user profile on auth state change:', error);
            setUser(null);
          }
        } else {
          console.log('No session user, setting user to null');
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    const checkUser = async () => {
      try {
        console.log('Initial check for logged in user');
        setIsLoading(true);
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          console.log('Session exists, fetching user profile');
          const userProfile = await getCurrentUserProfile();
          console.log('Initial user profile:', userProfile);
          setUser(userProfile);
        } else {
          console.log('No active session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    setIsLoading(true);
    try {
      await apiSignIn(email, password);
      console.log('Login successful');
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
    console.log('Logout attempt');
    setIsLoading(true);
    try {
      await apiSignOut();
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isSocialLoginLoading,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        loginWithPhone,
        verifyPhone,
        sendEmailVerificationCode,
        verifyEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
