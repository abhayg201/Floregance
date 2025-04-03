
import { createClient } from '@supabase/supabase-js';

// Use the values from our connected Supabase project
const supabaseUrl = "https://dlolhcrygcthnhpwrhcr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsb2xoY3J5Z2N0aG5ocHdyaGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjI0NjgsImV4cCI6MjA1Nzc5ODQ2OH0.0AkZS8CGY9CLJ_Wp3ysUfP-y6-KmT00m1DI980Pv1og";

// Create a single supabase client for the entire app with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Log connection status to help with debugging
console.log('Supabase client initialized with URL:', supabaseUrl);

/**
 * IMPORTANT: If you're experiencing authentication issues:
 * 
 * 1. In the Supabase dashboard, go to Authentication > URL Configuration
 * 2. Make sure the Site URL is set to your application URL
 * 3. Add your website URL and localhost to the Redirect URLs list
 * 4. For development, ensure localhost:5173 or whatever port you're using is listed
 */
