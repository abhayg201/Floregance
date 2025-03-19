
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  signUp as apiSignUp, 
  signIn as apiSignIn, 
  signInWithGoogle as apiSignInWithGoogle,
  signInWithFacebook as apiSignInWithFacebook,
  signOut as apiSignOut,
  getCurrentUserProfile,
  UserProfile
} from '@/services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
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

  // Listen for auth state changes
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

    // Initial check for logged in user
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
      // Auth state listener will handle updating the user state
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
      // For new signups, we'll log them in right away
      await apiSignIn(email, password);
      // Auth state listener will handle updating the user state
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    console.log('Google login attempt');
    try {
      await apiSignInWithGoogle();
      // Auth callback will handle redirects and updating the user state
      console.log('Google login redirect initiated');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    console.log('Facebook login attempt');
    try {
      await apiSignInWithFacebook();
      // Auth callback will handle redirects and updating the user state
      console.log('Facebook login redirect initiated');
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
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
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
