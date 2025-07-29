"use client";

// src/components/account/VerificationContent.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, AlertCircle, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
// Add Accordion imports
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// SVGs for Spotify and SoundCloud
const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="12" r="12" fill="#1DB954" />
    <path d="M17.25 16.25c-2.25-1.5-6.25-1.63-8.5-.75" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16.5 13.5c-1.88-1.13-5.13-1.38-7-.63" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15.75 10.75c-1.5-.75-4.25-.88-5.75-.38" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const SoundCloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect width="24" height="24" rx="12" fill="#FF5500" />
    <path d="M7.5 16.5a2.5 2.5 0 0 1 0-5c.2 0 .4.02.6.06A3.5 3.5 0 0 1 15 10.5c.1 0 .2 0 .3.01A2.5 2.5 0 1 1 17.5 16.5H7.5Z" fill="#fff"/>
  </svg>
);

export const VerificationContent = () => {
  const { userProfile, user: authUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<'not_applied' | 'pending' | 'verified' | 'rejected'>('not_applied');
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    artistName: '',
    genre: '',
    bio: '',
    spotify: '',
    soundcloud: '',
    instagram: ''
  });

  // Fetch verification status
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      // Wait for auth to be ready and ensure user is authenticated
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      if (!authUser) {
        console.log('No authenticated user found');
        setIsLoading(false);
        return;
      }

      if (userProfile?.id) {
        try {
          console.log('Fetching verification status for user:', userProfile.id);
          
          const { data, error } = await supabase
            .from('artist_verifications')
            .select('*')
            .eq('user_id', userProfile.id)
            .single();

          console.log('Verification query result:', { data, error });

          if (error) {
            console.error('Error fetching verification status:', error);
            if (error.code === 'PGRST116') {
              // No record found, which is expected for new artists
              setVerificationStatus('not_applied');
            } else {
              // Other error, show it in console for debugging
              console.error('Verification query failed:', error.message, error.details, error.hint);
            }
            return;
          }

          if (data) {
            console.log('Verification data found:', data);
            setVerificationStatus(data.status);
            // If there's existing application data, populate the form
            if (data.application_data) {
              const appData = data.application_data;
              setFormData({
                artistName: appData.artist_name || '',
                genre: appData.genre || '',
                bio: appData.bio || '',
                spotify: appData.social_links?.spotify || '',
                soundcloud: appData.social_links?.soundcloud || '',
                instagram: appData.social_links?.instagram || ''
              });
            }
          } else {
            setVerificationStatus('not_applied');
          }
        } catch (error) {
          console.error('Exception in fetchVerificationStatus:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No userProfile.id available');
        setIsLoading(false);
      }
    };

    fetchVerificationStatus();
  }, [userProfile, authUser, authLoading]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      setFiles(Array.from(newFiles));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const applicationData = {
        user_id: userProfile!.id,
        artist_name: formData.artistName,
        genre: formData.genre,
        bio: formData.bio,
        social_links: {
          spotify: formData.spotify,
          soundcloud: formData.soundcloud,
          instagram: formData.instagram
        },
        portfolio_links: [],
        experience_years: 0,
        reason_for_verification: "Artist verification request"
      };

      const { error } = await supabase
        .from('artist_verifications')
        .insert([{
          user_id: userProfile!.id,
          status: 'pending',
          application_data: applicationData
        }]);

      if (error) {
        toast({
          variant: "destructive",
          title: "Verification submission failed",
          description: error.message || "An error occurred while submitting your verification request",
        });
      } else {
        setVerificationStatus('pending');
        toast({
          variant: "success",
          title: "Verification submitted",
          description: "Your verification request has been submitted successfully. We'll review it and get back to you soon.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification submission failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: check if pending > 7 days
  const isPendingLong = verificationStatus === 'pending';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-white">Loading verification status...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white">Artist Verification</CardTitle>
            {verificationStatus === 'not_applied' && (
              <Badge variant="outline" className="bg-zinc-700/20 text-zinc-400 border-zinc-700/50">Not Applied</Badge>
            )}
            {verificationStatus === 'pending' && (
              <Badge variant="outline" className="bg-yellow-600/20 text-yellow-500 border-yellow-500/50">Pending</Badge>
            )}
            {verificationStatus === 'verified' && (
              <Badge variant="outline" className="bg-green-600/20 text-green-500 border-green-500/50">Verified</Badge>
            )}
            {verificationStatus === 'rejected' && (
              <Badge variant="outline" className="bg-red-600/20 text-red-500 border-red-500/50">Rejected</Badge>
            )}
          </div>
          <CardDescription className="text-zinc-400">
            {verificationStatus === 'not_applied' && 'Submit your verification request to get verified as an artist.'}
            {verificationStatus === 'pending' && 'Your verification is under review.'}
            {verificationStatus === 'verified' && 'You are a verified artist.'}
            {verificationStatus === 'rejected' && 'Your verification request was rejected. You can apply again.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationStatus === 'not_applied' && (
            <Accordion type="single" collapsible defaultValue="apply">
              <AccordionItem value="apply">
                <AccordionTrigger>Apply for Verification</AccordionTrigger>
                <AccordionContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Artist Information */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-white">Artist/Band Name</label>
                        <Input 
                          placeholder="Your artist or band name"
                          className="mt-1 bg-zinc-800 border-zinc-700"
                          value={formData.artistName}
                          onChange={(e) => setFormData({...formData, artistName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white">Genre</label>
                        <Input 
                          placeholder="e.g., Hip Hop, Rock, Electronic"
                          className="mt-1 bg-zinc-800 border-zinc-700"
                          value={formData.genre}
                          onChange={(e) => setFormData({...formData, genre: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-white">Bio</label>
                        <Textarea 
                          placeholder="Tell us about your music career..."
                          className="mt-1 bg-zinc-800 border-zinc-700 min-h-[100px]"
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          required
                        />
                      </div>
                      {/* Social Links */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Social Media Links (Optional)</label>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center pl-2"><SpotifyIcon className="w-5 h-5" /></span>
                          <Input 
                            placeholder="Spotify Profile URL"
                            className="mt-1 bg-zinc-800 border-zinc-700 pl-10"
                            value={formData.spotify}
                            onChange={(e) => setFormData({...formData, spotify: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center pl-2"><SoundCloudIcon className="w-5 h-5" /></span>
                          <Input 
                            placeholder="SoundCloud Profile URL"
                            className="mt-1 bg-zinc-800 border-zinc-700 pl-10"
                            value={formData.soundcloud}
                            onChange={(e) => setFormData({...formData, soundcloud: e.target.value})}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center pl-2"><Instagram className="w-5 h-5 text-pink-500" /></span>
                          <Input 
                            placeholder="Instagram Profile URL"
                            className="mt-1 bg-zinc-800 border-zinc-700 pl-10"
                            value={formData.instagram}
                            onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                          />
                        </div>
                      </div>
                      {/* Document Upload */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Verification Documents (Optional)</label>
                        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6">
                          <label className="flex flex-col items-center cursor-pointer">
                            <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                            <span className="text-sm text-zinc-400">Upload verification documents</span>
                            <span className="text-xs text-zinc-500 mt-1">
                              ID, Press Kit, or Other Proof of Artistry
                            </span>
                            <input
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                          </label>
                          {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {files.map((file, index) => (
                                <div key={index} className="text-sm text-zinc-400 flex items-center">
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                  {file.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Submit Button */}
                    <Button 
                      type="submit"
                      className="w-full bg-white text-black hover:bg-white-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Verification'}
                    </Button>
                  </form>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {verificationStatus === 'pending' && (
            <div className="flex flex-col items-center gap-6 py-10">
              <AlertCircle className="w-12 h-12 text-yellow-500 mb-2" />
              <div className="text-lg font-semibold text-yellow-400">Wait till your verification is accepted</div>
              <div className="text-zinc-400 text-center">
                {isPendingLong ? (
                  <>
                    It's been more than 1 week. Please <a href="/support" className="underline text-blue-400">contact support</a> for assistance.
                  </>
                ) : (
                  <>Our team is reviewing your request. You'll be notified once your account is verified.</>
                )}
              </div>
            </div>
          )}
          {verificationStatus === 'verified' && (
            <div className="flex flex-col items-center gap-6 py-10">
              <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
              <div className="text-2xl font-bold text-green-400">You are verified!</div>
              <div className="text-zinc-400 text-center">Congratulations, your artist account is now verified.</div>
            </div>
          )}
          {verificationStatus === 'rejected' && (
            <div className="flex flex-col items-center gap-6 py-10">
              <AlertCircle className="w-16 h-16 text-red-500 mb-2" />
              <div className="text-2xl font-bold text-red-400">Verification Rejected</div>
              <div className="text-zinc-400 text-center">
                Your verification request was not approved. You can submit a new application.
              </div>
              <Button 
                onClick={() => setVerificationStatus('not_applied')}
                className="bg-white text-black hover:bg-white-700"
              >
                Apply Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
