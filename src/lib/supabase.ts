
import { createClient } from '@supabase/supabase-js';

// Use the values from our connected Supabase project
const supabaseUrl = "https://dlolhcrygcthnhpwrhcr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsb2xoY3J5Z2N0aG5ocHdyaGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjI0NjgsImV4cCI6MjA1Nzc5ODQ2OH0.0AkZS8CGY9CLJ_Wp3ysUfP-y6-KmT00m1DI980Pv1og";

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log connection status to help with debugging
console.log('Supabase client initialized with URL:', supabaseUrl);
