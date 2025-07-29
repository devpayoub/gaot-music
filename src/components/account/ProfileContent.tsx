"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Camera, Music, Headphones, Clock, CreditCard, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProfileContentProps {
  userType: "User" | "Artist";
}

export function ProfileContent({ userType }: ProfileContentProps) {
  const [profilePic, setProfilePic] = useState("/default-avatar.png");

  // Regular User Profile
  const UserProfile = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card className="bg-zinc-800/50">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Add a profile picture to personalize your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={profilePic}
                alt="Profile"
                fill
                className="rounded-full object-cover"
              />
              <button
                className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                onClick={() => {/* Handle upload */}}
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <Button variant="outline" onClick={() => {/* Handle upload */}}>
              Upload New Picture
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              My Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="text-sm text-zinc-400">Albums purchased</div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-zinc-400">Tracks liked</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-zinc-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <div>
                <div className="font-medium">Purchased Album</div>
                <div className="text-sm text-zinc-400">Dark Side of the Moon</div>
              </div>
              <div className="text-sm text-zinc-400">2 days ago</div>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <div>
                <div className="font-medium">Added to Favorites</div>
                <div className="text-sm text-zinc-400">Bohemian Rhapsody</div>
              </div>
              <div className="text-sm text-zinc-400">5 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>

{/*  
      <Card className="bg-zinc-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-zinc-700 rounded flex items-center justify-center">
                  <span className="text-xs">VISA</span>
                </div>
                <div>
                  <div className="font-medium">•••• 4242</div>
                  <div className="text-sm text-zinc-400">Expires 12/24</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Remove</Button>
            </div>
            <Button className="w-full" variant="outline">Add New Payment Method</Button>
          </div>
        </CardContent>
      </Card> */}


      {/* Account Settings */}
      <Card className="bg-zinc-800/50">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value="user@example.com" readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Your name" />
          </div>
          <Button className="w-full">Update Settings</Button>
        </CardContent>
      </Card>
    </div>
  );

  // Artist Profile Implementation
  const ArtistProfile = () => {
    const { userProfile } = useAuth();
    const [bio, setBio] = useState(userProfile?.bio || "");
    const [profilePic, setProfilePic] = useState(userProfile?.profile_picture_url || "/default-avatar.png");
    const [socialLinks, setSocialLinks] = useState({
      instagram: userProfile?.social_links?.instagram || "",
      twitter: userProfile?.social_links?.twitter || "",
      facebook: userProfile?.social_links?.facebook || "",
      youtube: userProfile?.social_links?.youtube || ""
    });
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleProfilePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !userProfile) return;
      const filePath = `profile-pictures/${userProfile.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('profile-pictures').upload(filePath, file);
      if (error) {
        toast({ variant: "destructive", title: "Upload Failed", description: error.message });
        return;
      }
      const { data } = supabase.storage.from('profile-pictures').getPublicUrl(filePath);
      setProfilePic(data.publicUrl);
    };

    const handleSave = async () => {
      if (!userProfile) return;
      setIsSaving(true);
      const { error } = await supabase.from('users').update({
        bio,
        profile_picture_url: profilePic,
        social_links: socialLinks
      }).eq('id', userProfile.id);
      setIsSaving(false);
      if (error) {
        toast({ variant: "destructive", title: "Save Failed", description: error.message });
      } else {
        toast({ variant: "success", title: "Profile Updated", description: "Your profile has been updated." });
      }
    };

    return (
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <Card className="bg-zinc-800/50">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Add a profile picture to personalize your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={profilePic}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors cursor-pointer">
                  <Camera className="w-5 h-5" />
                  <input type="file" accept="image/*" onChange={handleProfilePicUpload} className="hidden" />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artist Bio Section */}
        <Card className="bg-zinc-800/50">
          <CardHeader>
            <CardTitle>Artist Bio</CardTitle>
            <CardDescription>Tell your fans about yourself</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Biography</label>
              <Textarea
                placeholder="Write a short bio about yourself or your band..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links Section */}
        <Card className="bg-zinc-800/50">
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>Connect with your fans across platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <label className="text-sm font-medium">Instagram</label>
                </div>
                <Input
                  placeholder="Instagram username"
                  value={socialLinks.instagram}
                  onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4 text-blue-400" />
                  <label className="text-sm font-medium">Twitter</label>
                </div>
                <Input
                  placeholder="Twitter username"
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium">Facebook</label>
                </div>
                <Input
                  placeholder="Facebook page URL"
                  value={socialLinks.facebook}
                  onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-red-500" />
                  <label className="text-sm font-medium">YouTube</label>
                </div>
                <Input
                  placeholder="YouTube channel URL"
                  value={socialLinks.youtube}
                  onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            className="bg-white hover:bg-white"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    );
  };

  return userType === "User" ? <UserProfile /> : <ArtistProfile />;
}
