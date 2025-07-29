'use client'
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Music} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [aka, setAka] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userType = isArtist ? 'Artist' : 'User';
      const { error } = await signUp(email, password, fullName, userType);

      if (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message || "An error occurred during registration",
        });
      } else {
        // Redirect to confirm email page
        router.push(`/register/confirm-email?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
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
            Join The Movement
          </CardTitle>
          <CardDescription className="text-muted-foreground">
          Create your The Goat Music account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-background/50 border-gold/30 focus:border-gold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aka" className="text-foreground">AKA (Optional)</Label>
              <Input
                id="aka"
                type="text"
                placeholder="your.aka"
                value={aka}
                onChange={(e) => setAka(e.target.value)}
                className="bg-background/50 border-gold/30 focus:border-gold"
              />
            </div>

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
                  minLength={6}
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

            <div className="flex items-center space-x-2 p-4 border border-gold/20 rounded-lg bg-background/20">
              <Checkbox 
                id="isArtist" 
                checked={isArtist}
                onCheckedChange={(checked) => setIsArtist(checked as boolean)}
                className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <div className="flex-1">
                <Label 
                  id="isArtist" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I'm an artist and want to sell my music
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll need admin approval to start selling your music
                </p>
              </div>
              <Music className="w-5 h-5 text-gold" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 ">
            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-gold/90 font-semibold mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="text-gold hover:text-gold/80 font-medium"
              >
                Log in here
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

export default Register;
    
