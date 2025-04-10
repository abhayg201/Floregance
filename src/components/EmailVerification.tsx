
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

interface EmailVerificationProps {
  email: string;
  onVerified?: () => void;
  onCancel?: () => void;
}

const EmailVerification = ({ email, onVerified, onCancel }: EmailVerificationProps) => {
  const { sendEmailVerificationCode, verifyEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      const response = await sendEmailVerificationCode(email);
      if (response.success) {
        toast.success(response.message);
        setCodeSent(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      toast.error('Please enter a valid verification code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyEmail(email, verificationCode);
      if (response.success) {
        toast.success('Email verified successfully!');
        if (onVerified) onVerified();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Failed to verify email');
    } finally {
      setIsLoading(false);
    }
  };

  if (!codeSent) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">Verify Your Email</h3>
          <p className="text-sm text-muted-foreground">
            We'll send a verification code to {email}
          </p>
        </div>

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
          Enter the 6-digit code sent to {email}
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

      <Button
        className="w-full"
        onClick={handleVerifyCode}
        disabled={isLoading || verificationCode.length < 6}
      >
        {isLoading ? 'Verifying...' : 'Verify Email'}
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

export default EmailVerification;
