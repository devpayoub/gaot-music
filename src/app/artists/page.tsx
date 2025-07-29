"use client";

import React, { useState, useEffect } from "react";
import { Search, Heart, Music, Users, MapPin, Calendar, TrendingUp, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '@/contexts/AuthContext';
import { ArtistService } from "@/services/artistService";
import { supabase } from "@/lib/supabase";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [followedArtists, setFollowedArtists] = useState<string[]>([]);
  const { requireAuth, userProfile } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    ArtistService.getArtists(1, 20, searchTerm).then(res => {
      setArtists(res.data || []);
      setLoading(false);
    });
  }, [searchTerm]);

  // Check which artists the user follows - optimized to reduce API calls
  useEffect(() => {
    if (!userProfile?.id || artists.length === 0) return;

    const checkFollowedArtists = async () => {
      try {
        // Get all followed artist IDs for this user in one query
        const { data: followedInteractions, error } = await supabase
          .from('user_interactions')
          .select('target_id')
          .eq('user_id', userProfile.id)
          .eq('target_type', 'artist')
          .eq('interaction_type', 'follow');

        if (error) {
          console.error('Error checking followed artists:', error);
          return;
        }

        const followedArtistIds = followedInteractions?.map((interaction: any) => interaction.target_id) || [];
        setFollowedArtists(followedArtistIds);
      } catch (error) {
        console.error('Error checking followed artists:', error);
      }
    };

    checkFollowedArtists();
  }, [userProfile?.id, artists]);

  const toggleFollow = async (artistId: string) => {
    if (!requireAuth('follow artist')) return;
    if (!userProfile?.id) return;

    try {
      const result = await ArtistService.toggleFollowArtist(userProfile.id, artistId);
      if (result.data) {
        setFollowedArtists(prev => 
          result.data.following 
            ? [...prev, artistId]
            : prev.filter(id => id !== artistId)
        );
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const filteredArtists = artists; // Already filtered by searchTerm in fetch

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121315] via-[#17191D] to-[#1a1c20] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-red-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Hero Section */}
        <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16" data-aos="fade-up">
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Discover Artists
              </h1>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                Find your favorite artists and discover new talent from around the world. 
                Connect with musicians, explore their stories, and stay updated with the latest releases.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-16" data-aos="fade-up" data-aos-delay="200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name or AKA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-400 h-14 text-lg"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" data-aos="fade-up" data-aos-delay="400">
              <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <CardTitle className="text-3xl text-white mb-2">{artists.length}</CardTitle>
                  <CardDescription className="text-zinc-400 text-lg">Total Artists</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8 text-center">
                  <Music className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <CardTitle className="text-3xl text-white mb-2">
                    {artists.reduce((sum, artist) => sum + (Number(artist.albums) || 0), 0)}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-lg">Total Albums</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <CardTitle className="text-3xl text-white mb-2">{followedArtists.length}</CardTitle>
                  <CardDescription className="text-zinc-400 text-lg">Following</CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Featured Artists Section */}
            {/* This section is removed as per the new_code, as featured artists are not fetched from Supabase */}

            {/* Trending Artists Section */}
            {/* This section is removed as per the new_code, as trending artists are not fetched from Supabase */}

            {/* All Artists Section */}
            <div data-aos="fade-up" data-aos-delay="1000">
              <h2 className="text-3xl font-bold text-white mb-8">All Artists</h2>
              {loading ? (
                <div className="text-center py-16">
                  <Music className="w-20 h-20 mx-auto mb-6 text-zinc-600 animate-spin" />
                  <h3 className="text-2xl font-semibold text-white mb-4">Loading artists...</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtists.map((artist, index) => (
                    <Card key={artist.aka} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 transform hover:scale-105" data-aos="fade-up" data-aos-delay={1200 + index * 50}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden">
                              <Image
                                src={artist.profile_picture_url || "/artists/default.jpg"}
                                alt={artist.full_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{artist.full_name}</h3>
                              <p className="text-sm text-zinc-400">AKA {artist.aka}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFollow(artist.id)}
                            className={`p-2 rounded-full transition-colors ${
                              followedArtists.includes(artist.id)
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-zinc-700 hover:bg-zinc-600'
                            }`}
                          >
                            <Heart 
                              className={`w-5 h-5 ${
                                followedArtists.includes(artist.id) ? 'text-white fill-white' : 'text-zinc-400'
                              }`} 
                            />
                          </button>
                        </div>
                        <p className="text-sm text-zinc-300 mb-4 line-clamp-2">{artist.bio}</p>
                        <div className="flex items-center justify-between text-sm text-zinc-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{artist.location}</span>
                          </div>
                          <span className="bg-zinc-700 px-2 py-1 rounded text-xs">RAP</span>
                        </div>
                        <Link href={`/artists/${encodeURIComponent(artist.aka)}`}>
                          <Button className="w-full bg-white text-black hover:bg-gray-200">
                            View Profile
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {!loading && filteredArtists.length === 0 && (
                <div className="text-center py-16" data-aos="fade-up">
                  <Music className="w-20 h-20 mx-auto mb-6 text-zinc-600" />
                  <h3 className="text-2xl font-semibold text-white mb-4">No artists found</h3>
                  <p className="text-zinc-400 text-lg">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
 