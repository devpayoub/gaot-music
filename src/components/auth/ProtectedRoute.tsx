"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      const currentUrl = window.location.pathname + window.location.search;
      const loginUrl = `/login?redirect=${encodeURIComponent(currentUrl)}`;
      router.push(loginUrl);
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#17191D] to-[#121315]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render children if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return <>{children}</>;
} 