
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface PhoneVerificationProps {
  onVerified?: () => void;
  onCancel?: () => void;
}

const PhoneVerification = ({ onVerified, onCancel }: PhoneVerificationProps) => {
  const { loginWithPhone, verifyPhone } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    setError('');
    if (!phoneNumber || !phoneNumber.match(/^\+[1-9]\d{1,14}$/)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      toast.error('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending code to phone number:', phoneNumber);
      const response = await loginWithPhone(phoneNumber);
      console.log('Phone login response:', response);
      
      if (response.success) {
        toast.success(response.message);
        setCodeSent(true);
      } else {
        setError(response.message || 'Failed to send verification code');
        toast.error(response.message || 'Failed to send verification code');
      }
    } catch (error: any) {
      console.error('Phone login error:', error);
      setError(error.message || 'Failed to send verification code');
      toast.error('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    if (!verificationCode || verificationCode.length < 6) {
      setError('Please enter a valid verification code');
      toast.error('Please enter a valid verification code');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Verifying code for phone number:', phoneNumber);
      const response = await verifyPhone(phoneNumber, verificationCode);
      console.log('Phone verification response:', response);
      
      if (response.success) {
        toast.success('Phone verified successfully!');
        if (onVerified) onVerified();
      } else {
        setError(response.message || 'Failed to verify code');
        toast.error(response.message || 'Failed to verify code');
      }
    } catch (error: any) {
      console.error('Phone verification error:', error);
      setError(error.message || 'Failed to verify phone number');
      toast.error('Failed to verify phone number');
    } finally {
      setIsLoading(false);
    }
  };

  if (!codeSent) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">Phone Number Login</h3>
          <p className="text-sm text-muted-foreground">
            Enter your phone number to receive a verification code
          </p>
        </div>

        <Input
          type="tel"
          placeholder="+1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          className="w-full"
          onClick={handleSendCode}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Verification Code'}
        </Button>
        
        {onCancel && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Enter Verification Code</h3>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to {phoneNumber}
        </p>
      </div>

      <div className="flex justify-center my-4">
        <InputOTP
          maxLength={6}
          value={verificationCode}
          onChange={setVerificationCode}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} index={index} />
              ))}
            </InputOTPGroup>
          )}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        className="w-full"
        onClick={handleVerifyCode}
        disabled={isLoading || verificationCode.length < 6}
      >
        {isLoading ? 'Verifying...' : 'Verify & Login'}
      </Button>

      <div className="flex justify-between pt-2">
        <Button
          variant="link"
          className="px-0"
          onClick={handleSendCode}
          disabled={isLoading}
        >
          Resend Code
        </Button>
        
        {onCancel && (
          <Button
            variant="link"
            className="px-0"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhoneVerification;
