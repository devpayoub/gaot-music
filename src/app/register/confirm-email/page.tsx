'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

const ConfirmEmail: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Failed to resend email",
          description: error.message || "An error occurred while resending the email",
        });
      } else {
        toast({
          variant: "success",
          title: "Email resent",
          description: "A new verification email has been sent to your inbox",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to resend email",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 urban-pattern relative overflow-hidden">
      <Image
        src="/login.jpg"
        alt="login background"
        fill
        className="object-cover -z-20 opacity-80"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
      
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border-gold/30 relative z-10" data-aos="zoom-in">
        <CardHeader className="text-center">
          <div className="vinyl-record w-16 h-16 mx-auto mb-4 animate-spin-slow">
            <div className="w-full h-full flex items-center justify-center dark:invert">
                <Image src="/logo2.png" alt="logo" width={100} height={100}/>
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display font-bold gradient-text">
            Check your email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                We've sent a verification email to:
              </h3>
              <p className="font-medium text-gold">{email}</p>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Click the verification link in the email to complete your registration.
              </p>
              <p>
                If you don't see the email, check your spam folder.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            onClick={() => router.push('/login')}
            className="w-full bg-white text-black hover:bg-gold/90 font-semibold"
          >
            Back to Login
          </Button>

          <div className="text-center">
            <Link 
              href="/register" 
              className="text-sm text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Registration
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmEmail;
