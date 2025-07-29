'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setIsLoading(false);
    }
    // If successful, the auth context will handle the redirect and loading state
  }

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
          <CardTitle className="text-2xl font-display font-bold gradient-text">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Log in to your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-gold/30 focus:border-gold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-gold/30 focus:border-gold pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 ">
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gold/90 font-semibold mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-gold hover:text-gold/80 font-medium"
              >
                Sign up here
              </Link>
            </div>

            <div className="text-center">
              <Link 
               href="/" 
                className="text-sm text-muted-foreground hover:text-gold transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
    
