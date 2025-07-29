"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate admin email
    if (!formData.email.includes('@admin.com')) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Admin email must contain @admin.com",
      });
      setIsLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match.",
      });
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(formData.email, formData.password, formData.fullName, 'User');
      
      if (!result.error) {
        toast({
          variant: "success",
          title: "Admin Account Created",
          description: "Your admin account has been created successfully. Please check your email to verify your account.",
        });
        router.push('/admin/login');
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.error || "Failed to create admin account.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailValid = formData.email.includes('@admin.com');
  const isPasswordValid = formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;

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
            <CardTitle className="text-2xl font-bold text-white">Create Admin Account</CardTitle>
            <CardDescription className="text-zinc-400">
              Set up the first admin account for the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-white">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Admin Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@admin.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  required
                />
                {formData.email && (
                  <div className={`flex items-center gap-2 text-sm ${isEmailValid ? 'text-green-400' : 'text-red-400'}`}>
                    {isEmailValid ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{isEmailValid ? 'Valid admin email' : 'Email must be an admin email (@admin.com)'}</span>
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
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                {formData.password && (
                  <div className={`flex items-center gap-2 text-sm ${isPasswordValid ? 'text-green-400' : 'text-red-400'}`}>
                    {isPasswordValid ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{isPasswordValid ? 'Strong password' : 'Password must be at least 8 characters'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-white pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className={`flex items-center gap-2 text-sm ${doPasswordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                    {doPasswordsMatch ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading || !isEmailValid || !isPasswordValid || !doPasswordsMatch}
              >
                {isLoading ? 'Creating Account...' : 'Create Admin Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/admin/login" className="text-zinc-400 hover:text-zinc-300 text-sm">
                Already have an admin account? Sign in
              </Link>
            </div>

            <div className="mt-4 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">Admin Account Setup</p>
                  <p className="text-blue-400">
                    This will create the first admin account for the platform. 
                    Only use this for initial setup. Admin accounts require @admin.com email addresses.
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