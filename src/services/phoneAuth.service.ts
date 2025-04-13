
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PhoneAuthResponse } from './types/auth.types';

class PhoneAuthService {
  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<PhoneAuthResponse> {
    try {
      console.log('Sending OTP to phone number:', phoneNumber);
      
      // Validate phone number format (simple validation)
      if (!phoneNumber || !phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
        return { 
          success: false, 
          message: 'Please enter a valid phone number with country code (e.g., +1234567890)' 
        };
      }
      
      // Call Supabase phone auth function
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
        options: {
          // Make sure channel is SMS
          channel: 'sms'
        }
      });
      
      console.log('OTP response:', data, error);
      
      if (error) {
        console.error('Error sending OTP:', error);
        return { success: false, message: error.message };
      }
      
      return { 
        success: true, 
        message: 'Verification code has been sent to your phone',
        otpSent: true
      };
    } catch (error: any) {
      console.error('Phone auth service error:', error);
      return { success: false, message: error.message || 'Error sending verification code' };
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber: string, otp: string): Promise<PhoneAuthResponse> {
    try {
      console.log('Verifying OTP for phone:', phoneNumber);
      
      // Validate OTP format (simple validation)
      if (!otp || otp.length < 6) {
        return { success: false, message: 'Please enter a valid verification code' };
      }
      
      // Call Supabase verify function
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms'
      });
      
      console.log('Verify OTP response:', data, error);
      
      if (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: error.message };
      }
      
      // Update profile if user is logged in
      if (data.user) {
        // Update phone_confirmed in profile
        await supabase
          .from('profiles')
          .update({
            phone_number: phoneNumber,
            phone_confirmed: true,
            last_login: new Date().toISOString()
          })
          .eq('id', data.user.id);
      }

      console.log('OTP verified successfully');
      return { 
        success: true, 
        message: 'Phone number verified successfully',
        verified: true
      };
    } catch (error: any) {
      console.error('Phone verification error:', error);
      return { success: false, message: error.message || 'Error verifying code' };
    }
  }
}

export const phoneAuthService = new PhoneAuthService();
