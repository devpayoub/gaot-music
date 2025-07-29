"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if email is admin email
    if (!email.includes('@admin.com')) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only admin emails (@admin.com) can access this page.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn(email, password);
      
      if (!result.error) {
        toast({
          variant: "success",
          title: "Admin Login Successful",
          description: "Welcome to the admin panel!",
        });
        router.push('/admin');
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error || "Invalid admin credentials.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#17191D] to-[#121315] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Login</CardTitle>
            <CardDescription className="text-zinc-400">
              Access the admin panel with your admin credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@admin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
                {email && !email.includes('@admin.com') && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Email must be an admin email (@admin.com)</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading || !email.includes('@admin.com')}
              >
                {isLoading ? 'Signing In...' : 'Sign In as Admin'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-zinc-400 hover:text-zinc-300 text-sm">
                ← Back to Home
              </Link>
            </div>

            <div className="mt-4 text-center">
              <Link href="/admin/register" className="text-blue-400 hover:text-blue-300 text-sm">
                Need to create admin account? Register here
              </Link>
            </div>

            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">Admin Access Required</p>
                  <p className="text-blue-400">
                    Only users with @admin.com email addresses can access the admin panel. 
                    Contact the system administrator to get admin credentials.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 