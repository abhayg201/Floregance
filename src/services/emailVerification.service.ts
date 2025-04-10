
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { EmailVerificationResponse } from './types/auth.types';

class EmailVerificationService {
  // Send verification email with OTP
  async sendVerificationEmail(email: string): Promise<EmailVerificationResponse> {
    try {
      console.log('Sending verification email to:', email);
      
      // Call Supabase email OTP function
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // This will send a "magiclink" but also include OTP
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Error sending verification email:', error);
        return { success: false, message: error.message };
      }

      console.log('Verification email sent successfully');
      return { 
        success: true, 
        message: 'Verification email has been sent. Please check your inbox.'
      };
    } catch (error: any) {
      console.error('Email verification service error:', error);
      return { success: false, message: error.message || 'Error sending verification email' };
    }
  }

  // Verify email with OTP code
  async verifyEmailOTP(email: string, otp: string): Promise<EmailVerificationResponse> {
    try {
      console.log('Verifying email with OTP:', email);
      
      // Call Supabase verify function
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });
      
      if (error) {
        console.error('Error verifying email OTP:', error);
        return { success: false, message: error.message };
      }
      
      // Update profile if user is logged in
      if (data.user) {
        // Update email_confirmed in profile
        await supabase
          .from('profiles')
          .update({
            email_confirmed: true,
            last_login: new Date().toISOString()
          })
          .eq('id', data.user.id);
      }

      console.log('Email OTP verified successfully');
      return { 
        success: true, 
        message: 'Email verified successfully'
      };
    } catch (error: any) {
      console.error('Email verification error:', error);
      return { success: false, message: error.message || 'Error verifying email code' };
    }
  }
}

export const emailVerificationService = new EmailVerificationService();
