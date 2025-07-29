"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, User, Music, MapPin, Globe, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface VerificationRequest {
  id: string;
  user_id: string;
  status: 'pending' | 'verified' | 'rejected';
  application_data: {
    artist_name: string;
    genre: string;
    bio: string;
    social_links?: {
      spotify?: string;
      soundcloud?: string;
      instagram?: string;
    };
  };
  rejection_reason?: string;
  created_at: string;
  users: {
    id: string;
    full_name: string;
    email: string;
    profile_picture_url?: string;
  };
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Check if user is admin (you can modify this logic based on your admin system)
  useEffect(() => {
    if (userProfile && userProfile.email?.includes('@admin.com')) {
      // Allow access only to users with @admin.com email
      fetchVerifications();
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only admin users can access this page. Please login with admin credentials.",
      });
      router.push('/admin/login');
    }
  }, [userProfile]);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_verifications')
        .select(`
          *,
          users!artist_verifications_user_id_fkey (
            id,
            full_name,
            email,
            profile_picture_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching verifications:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load verification requests.",
        });
        return;
      }

      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (verificationId: string, action: 'approve' | 'reject', reason?: string) => {
    setProcessingId(verificationId);
    
    try {
      if (action === 'approve') {
        // Approve verification
        const { error } = await supabase
          .from('artist_verifications')
          .update({
            status: 'verified',
            verified_at: new Date().toISOString()
          })
          .eq('id', verificationId);

        if (error) {
          throw error;
        }

        toast({
          variant: "success",
          title: "Artist Verified",
          description: "The artist has been successfully verified.",
        });
      } else {
        // Reject verification
        const { error } = await supabase
          .from('artist_verifications')
          .update({
            status: 'rejected',
            rejection_reason: reason || 'Application rejected'
          })
          .eq('id', verificationId);

        if (error) {
          throw error;
        }

        toast({
          variant: "success",
          title: "Application Rejected",
          description: "The verification request has been rejected.",
        });
      }

      // Refresh the list
      await fetchVerifications();
    } catch (error: any) {
      console.error('Error processing verification:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process verification request.",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500/20 text-green-500">Verified</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
    }
  };

  const pendingVerifications = verifications.filter(v => v.status === 'pending');
  const verifiedArtists = verifications.filter(v => v.status === 'verified');
  const rejectedApplications = verifications.filter(v => v.status === 'rejected');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#17191D] to-[#121315] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading verification requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#17191D] to-[#121315] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Artist Verification Management</h1>
          <p className="text-zinc-400">Review and manage artist verification requests</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
            <TabsTrigger value="pending" className="data-[state=active]:bg-zinc-700">
              Pending ({pendingVerifications.length})
            </TabsTrigger>
            <TabsTrigger value="verified" className="data-[state=active]:bg-zinc-700">
              Verified ({verifiedArtists.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-zinc-700">
              Rejected ({rejectedApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingVerifications.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                  <p className="text-zinc-400">No pending verification requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingVerifications.map((verification) => (
                <Card key={verification.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{verification.users.full_name}</CardTitle>
                          <CardDescription className="text-zinc-400">{verification.users.email}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(verification.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Artist Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Music className="w-4 h-4 text-zinc-500" />
                            <span className="text-zinc-300">Artist Name: {verification.application_data.artist_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-500" />
                            <span className="text-zinc-300">Genre: {verification.application_data.genre}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Social Links</h4>
                        <div className="space-y-2 text-sm">
                          {verification.application_data.social_links?.spotify && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-zinc-500" />
                              <span className="text-zinc-300">Spotify: {verification.application_data.social_links.spotify}</span>
                            </div>
                          )}
                          {verification.application_data.social_links?.instagram && (
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-zinc-500" />
                              <span className="text-zinc-300">Instagram: {verification.application_data.social_links.instagram}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Bio</h4>
                      <p className="text-zinc-300 text-sm">{verification.application_data.bio}</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => handleVerification(verification.id, 'approve')}
                        disabled={processingId === verification.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingId === verification.id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button
                        onClick={() => handleVerification(verification.id, 'reject')}
                        disabled={processingId === verification.id}
                        variant="destructive"
                      >
                        {processingId === verification.id ? 'Processing...' : 'Reject'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="verified" className="space-y-4">
            {verifiedArtists.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-zinc-400">No verified artists yet</p>
                </CardContent>
              </Card>
            ) : (
              verifiedArtists.map((verification) => (
                <Card key={verification.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{verification.users.full_name}</CardTitle>
                          <CardDescription className="text-zinc-400">{verification.users.email}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(verification.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-zinc-300">
                      <p><strong>Artist Name:</strong> {verification.application_data.artist_name}</p>
                      <p><strong>Genre:</strong> {verification.application_data.genre}</p>
                      <p><strong>Verified on:</strong> {new Date(verification.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedApplications.length === 0 ? (
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6 text-center">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-zinc-400">No rejected applications</p>
                </CardContent>
              </Card>
            ) : (
              rejectedApplications.map((verification) => (
                <Card key={verification.id} className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{verification.users.full_name}</CardTitle>
                          <CardDescription className="text-zinc-400">{verification.users.email}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(verification.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-zinc-300">
                      <p><strong>Artist Name:</strong> {verification.application_data.artist_name}</p>
                      <p><strong>Genre:</strong> {verification.application_data.genre}</p>
                      <p><strong>Rejection Reason:</strong> {verification.rejection_reason || 'No reason provided'}</p>
                      <p><strong>Rejected on:</strong> {new Date(verification.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 