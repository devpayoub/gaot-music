"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  user_type: 'User' | 'Artist';
  aka?: string;
  bio?: string;
  profile_picture_url?: string;
  location?: string;
  genre?: string;
  social_links?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, userType: 'User' | 'Artist') => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  createUserProfile: (userId: string, email: string, fullName: string, userType: 'User' | 'Artist') => Promise<{ error: any }>;
  requireAuth: (action: string, redirectUrl?: string) => boolean;
  redirectAfterLogin: string | null;
  clearRedirectAfterLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Check for redirect parameter on mount
  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectAfterLogin(redirect);
    }
  }, [searchParams]);

  // Load user profile from database
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, try to create it from user metadata
        if (error.code === 'PGRST116') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const userMetadata = user.user_metadata;
            const fullName = userMetadata?.full_name || '';
            const userType = userMetadata?.user_type || 'User';
            
            // Try to create the profile
            const { error: createError } = await createUserProfile(
              userId,
              user.email!,
              fullName,
              userType
            );
            
            if (!createError) {
              // Reload the profile after creation
              const { data: newProfile } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
              
              if (newProfile) {
                setUserProfile(newProfile);
              }
            }
          }
        } else {
          console.error('Error loading user profile:', error);
        }
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event: string, session: any) => {
            setUser(session?.user ?? null);
            
            if (session?.user) {
              await loadUserProfile(session.user.id);
            } else {
              setUserProfile(null);
            }
            
            setIsLoading(false);
          }
        );

        setIsLoading(false);
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, userType: 'User' | 'Artist') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: error.message,
        });
        return { error };
      }

      if (data.user && !data.session) {
        // User needs to confirm email
        toast({
          variant: "success",
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
      } else if (data.user && data.session) {
        // User is already confirmed (shouldn't happen with email confirmation enabled)
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
              user_type: userType,
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          toast({
            variant: "destructive",
            title: "Profile creation failed",
            description: "Please try again or contact support.",
          });
          return { error: profileError };
        }

        toast({
          variant: "success",
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
        return { error };
      }

      if (data.user) {
        toast({
          variant: "success",
          title: "Login successful",
          description: "Welcome back!",
        });

        // Redirect to stored URL if exists
        if (redirectAfterLogin) {
          router.push(redirectAfterLogin);
          setRedirectAfterLogin(null);
        } else {
          router.push('/');
        }
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: error.message,
        });
        return;
      }

      setUser(null);
      setUserProfile(null);
      router.push('/');
      
      toast({
        variant: "success",
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An unexpected error occurred.",
      });
    }
  };

  const createUserProfile = async (userId: string, email: string, fullName: string, userType: 'User' | 'Artist') => {
    try {
      // First check if profile already exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        // Profile already exists, no need to create
        return { error: null };
      }

      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: email,
            full_name: fullName,
            user_type: userType,
          }
        ]);

      if (error) {
        console.error('Error creating user profile:', error);
        toast({
          variant: "destructive",
          title: "Profile creation failed",
          description: "Please try again or contact support.",
        });
        return { error };
      }

      toast({
        variant: "success",
        title: "Profile created",
        description: "Your profile has been created successfully.",
      });
      return { error: null };
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast({
        variant: "destructive",
        title: "Profile creation failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return { error };
    }
  };

  const requireAuth = (action: string, redirectUrl?: string): boolean => {
    if (!user) {
      const currentUrl = redirectUrl || window.location.pathname + window.location.search;
      const loginUrl = `/login?redirect=${encodeURIComponent(currentUrl)}`;
      router.push(loginUrl);
      
      toast({
        variant: "warning",
        title: "Authentication required",
        description: `Please log in to ${action}.`,
      });
      
      return false;
    }
    return true;
  };

  const clearRedirectAfterLogin = () => {
    setRedirectAfterLogin(null);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    isLoggedIn: !!user,
    isLoading,
    signUp,
    signIn,
    signOut,
    createUserProfile,
    requireAuth,
    redirectAfterLogin,
    clearRedirectAfterLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 