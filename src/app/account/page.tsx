"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/account/Sidebar";
import AccountMain from "@/components/account/AccountMain";
import NavbarAccount from "@/components/account/Navbar";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

export default function AccountPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [active, setActive] = useState(tabParam || "Profile");
  const [verificationStatus, setVerificationStatus] = useState<"Pending" | "Verified" | "Rejected" | "not_applied">("not_applied");
  const [followersCount, setFollowersCount] = useState(0);
  const { userProfile, user: authUser, isLoading } = useAuth();
  
  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam) {
      setActive(tabParam);
    }
  }, [tabParam]);

  // Fetch verification status for artists
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      // Wait for auth to be ready and ensure user is authenticated
      if (isLoading) {
        console.log('Account page: Auth still loading, waiting...');
        return;
      }

      if (!authUser) {
        console.log('Account page: No authenticated user found');
        return;
      }

      if (userProfile?.user_type === 'Artist' && userProfile?.id) {
        try {
          console.log('Account page: Fetching verification status for artist:', userProfile.id);
          
          const { data, error } = await supabase
            .from('artist_verifications')
            .select('status')
            .eq('user_id', userProfile.id)
            .single();

          console.log('Account page: Verification query result:', { data, error });

          if (error) {
            console.error('Account page: Error fetching verification status:', error);
            if (error.code === 'PGRST116') {
              // No record found, which is expected for new artists
              setVerificationStatus("not_applied");
            } else {
              // Other error, show it in console for debugging
              console.error('Account page: Verification query failed:', error.message, error.details, error.hint);
            }
            return;
          }

          if (data) {
            console.log('Account page: Verification data found:', data);
            // Map database status to display status
            const statusMapping = {
              'verified': 'Verified',
              'pending': 'Pending', 
              'rejected': 'Rejected',
              'not_applied': 'Pending'
            };
            setVerificationStatus((statusMapping[data.status as keyof typeof statusMapping] || "Pending") as "Pending" | "Verified" | "Rejected" | "not_applied");
          } else {
            setVerificationStatus("not_applied");
          }
        } catch (error) {
          console.error('Account page: Exception in fetchVerificationStatus:', error);
        }
      } else {
        console.log('Account page: Not an artist or no userProfile.id available');
      }
    };

    fetchVerificationStatus();
  }, [userProfile, authUser, isLoading]);

  // Fetch follower count for artists
  useEffect(() => {
    const fetchFollowersCount = async () => {
      if (isLoading || !authUser || userProfile?.user_type !== 'Artist' || !userProfile?.id) {
        return;
      }

      try {
        const { count, error } = await supabase
          .from('user_interactions')
          .select('*', { count: 'exact', head: true })
          .eq('target_id', userProfile.id)
          .eq('target_type', 'artist')
          .eq('interaction_type', 'follow');

        if (error) {
          console.error('Error fetching followers count:', error);
          return;
        }

        setFollowersCount(count || 0);
      } catch (error) {
        console.error('Exception fetching followers count:', error);
      }
    };

    fetchFollowersCount();
  }, [userProfile, authUser, isLoading]);

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#17191D] to-[#121315]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Transform userProfile to match Sidebar's expected interface
  const user = userProfile ? {
    name: userProfile.full_name,
    email: userProfile.email,
    type: userProfile.user_type as "User" | "Artist",
    status: userProfile.user_type === 'Artist' ? 
      (verificationStatus === "not_applied" ? "Pending" : verificationStatus as "Pending" | "Verified" | "Rejected") : 
      "Verified" as const,
    followersCount: userProfile.user_type === 'Artist' ? followersCount : 0
  } : null;

  // Debug logging
  console.log('Account page: Final user object:', user);
  console.log('Account page: Verification status:', verificationStatus);

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#17191D] to-[#121315]">
        <NavbarAccount />
        
        <main className="flex-1 mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Always visible, stacks on mobile */}
              {user && (
                <Sidebar 
                  user={user}
                  active={active}
                  setActive={setActive}
                />
              )}
              
              {/* Main Content */}
              <div className="flex-1">
                <AccountMain 
                  active={active}
                  userType={userProfile?.user_type || 'User'}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}