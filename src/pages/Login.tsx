
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import SocialLoginButtons from '@/components/SocialLoginButtons';
import EmailVerification from '@/components/EmailVerification';
import PhoneVerification from '@/components/PhoneVerification';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'email-password' | 'email-verification' | 'phone'>('email-password');
  const [emailForVerification, setEmailForVerification] = useState('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      toast.success('Successfully logged in!');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      // Check if the error is related to email confirmation
      if (error.message?.includes('email not confirmed') || error.message?.includes('Email not confirmed')) {
        toast.error('Email not confirmed. Please verify your email.');
        setEmailForVerification(values.email);
        setAuthMode('email-verification');
      } else {
        toast.error('Invalid email or password. Hint: use "password" as the password for demo');
      }
    }
  };

  const handleVerificationSuccess = () => {
    toast.success('Verification successful! You can now log in.');
    setAuthMode('email-password');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-medium">Welcome back</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Enter your details to sign in to your account
            </p>
          </div>

          <Tabs defaultValue="email-password" onValueChange={(value: any) => setAuthMode(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email-password">Email</TabsTrigger>
              <TabsTrigger value="email-verification">Email OTP</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="email-password">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <Link to="/signup" className="text-primary hover:text-primary/80">
                        Don't have an account? Sign up
                      </Link>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="email-verification">
              <EmailVerification 
                email={emailForVerification || form.getValues().email} 
                onVerified={handleVerificationSuccess}
                onCancel={() => setAuthMode('email-password')}
              />
            </TabsContent>

            <TabsContent value="phone">
              <PhoneVerification
                onVerified={handleVerificationSuccess}
                onCancel={() => setAuthMode('email-password')}
              />
            </TabsContent>
          </Tabs>

          <SocialLoginButtons />

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>For demo purposes, use any email with password "password"</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
