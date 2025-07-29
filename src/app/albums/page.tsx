"use client";

import React, { useState, useEffect } from "react";
import { Search, Heart, Music, TrendingUp, Clock, Play, ShoppingCart, Star, Award, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '@/contexts/AuthContext';
import { AlbumService } from "@/services/albumService";
import { supabase } from "@/lib/supabase";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedAlbums, setLikedAlbums] = useState<string[]>([]);
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
    AlbumService.getPublicAlbums(1, 20, searchTerm).then(res => {
      setAlbums(res.data || []);
      setLoading(false);
    });
  }, [searchTerm]);

  // Check which albums the user has liked - optimized to reduce API calls
  useEffect(() => {
    if (!userProfile?.id || albums.length === 0) return;

    const checkLikedAlbums = async () => {
      try {
        // First, check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current authenticated user:', user);
        
        if (!user) {
          console.error('No authenticated user found');
          return;
        }

        // Get all liked album IDs for this user in one query
        const { data: likedInteractions, error } = await supabase
          .from('user_interactions')
          .select('target_id')
          .eq('user_id', userProfile.id)
          .eq('target_type', 'album')
          .eq('interaction_type', 'like');

        console.log('Liked interactions query:', { likedInteractions, error });

        if (error) {
          console.error('Error checking liked albums:', error);
          return;
        }

        const likedAlbumIds = likedInteractions?.map((interaction: any) => interaction.target_id) || [];
        console.log('Liked album IDs:', likedAlbumIds);
        setLikedAlbums(likedAlbumIds);
      } catch (error) {
        console.error('Error checking liked albums:', error);
      }
    };

    checkLikedAlbums();
  }, [userProfile?.id, albums]);

  const toggleAlbumLike = async (albumId: string) => {
    console.log('=== ALBUM LIKE DEBUG ===');
    console.log('User profile:', userProfile);
    console.log('Album ID:', albumId);
    
    if (!userProfile?.id) {
      console.error('No user profile or user ID');
      return;
    }

    if (!requireAuth('like album')) {
      console.error('Auth check failed');
      return;
    }

    console.log('Toggling album like for album:', albumId, 'user:', userProfile.id);

    try {
      const result = await AlbumService.toggleAlbumLike(userProfile.id, albumId);
      console.log('Toggle album like result:', result);
      
      if (result.error) {
        console.error('AlbumService returned error:', result.error);
        return;
      }
      
      if (result.data) {
        console.log('Updating UI state...');
        setLikedAlbums(prev => {
          const newState = result.data.liked 
            ? [...prev, albumId]
            : prev.filter(id => id !== albumId);
          console.log('New liked albums state:', newState);
          return newState;
        });
        
        // Refresh the album data to get the updated like count
        const { data: updatedAlbum, error: refreshError } = await supabase
          .from('albums')
          .select('likes_count')
          .eq('id', albumId)
          .single();
        
        if (!refreshError && updatedAlbum) {
          console.log('Updated album like count:', updatedAlbum.likes_count);
          setAlbums(prev => prev.map(album => 
            album.id === albumId 
              ? { ...album, likes_count: updatedAlbum.likes_count }
              : album
          ));
        } else {
          console.error('Error refreshing album data:', refreshError);
          // Fallback to manual update
          setAlbums(prev => prev.map(album => 
            album.id === albumId 
              ? { ...album, likes_count: result.data.liked ? (album.likes_count || 0) + 1 : Math.max(0, (album.likes_count || 0) - 1) }
              : album
          ));
        }
      }
    } catch (error) {
      console.error('Error toggling album like:', error);
    }
  };

  const handleBuyAlbum = (albumId: string) => {
    if (!requireAuth('buy album')) return;
    // Handle purchase logic here
    console.log(`Buying album ${albumId}`);
  };

  const filteredAlbums = albums; // Already filtered by searchTerm in fetch

  const AlbumCard = ({ album }: { album: any }) => (
    <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 transform hover:scale-105">
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4">
          <Image
            src={album.cover_image_url || "/albums/default.jpg"}
            alt={album.title}
            fill
            className="object-cover rounded-lg"
          />
          <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors">
            <Play className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-1">{album.title}</h3>
          <p className="text-sm text-zinc-400 mb-1">{album.users?.full_name || "Unknown Artist"}</p>
          <p className="text-sm text-zinc-500">{album.release_year} • {album.total_duration || 0} min</p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => toggleAlbumLike(album.id)}
            className={`flex items-center gap-1 text-sm ${likedAlbums.includes(album.id) ? 'text-red-500' : 'text-zinc-400'}`}
          >
            <Heart className={`w-4 h-4 ${likedAlbums.includes(album.id) ? 'fill-red-500' : ''}`} />
            {album.likes_count || 0}
          </button>
          <span className="text-white font-semibold">${album.price}</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/albums/${encodeURIComponent(album.title)}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700">
              View Album
            </Button>
          </Link>
          <Button 
            size="sm" 
            className="bg-white text-black hover:bg-gray-200"
            onClick={() => handleBuyAlbum(album.id)}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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

        <div className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16" data-aos="fade-up">
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Discover Albums
              </h1>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                Find the latest releases and timeless classics from your favorite artists. 
                Explore new music, discover hidden gems, and build your perfect collection.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-16" data-aos="fade-up" data-aos-delay="200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search albums or artists..."
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
                  <Music className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <CardTitle className="text-3xl text-white mb-2">{albums.length}</CardTitle>
                  <CardDescription className="text-zinc-400 text-lg">Total Albums</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <CardTitle className="text-3xl text-white mb-2">{albums.length}</CardTitle>
                  <CardDescription className="text-zinc-400 text-lg">Popular Albums</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-8 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <CardTitle className="text-3xl text-white mb-2">{albums.length}</CardTitle>
                  <CardDescription className="text-zinc-400 text-lg">New Releases</CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* All Albums Section */}
            <div data-aos="fade-up" data-aos-delay="1400">
              <h2 className="text-3xl font-bold text-white mb-8">All Albums</h2>
              
              
              {loading ? (
                <div className="text-center py-16">
                  <Music className="w-20 h-20 mx-auto mb-6 text-zinc-600 animate-spin" />
                  <h3 className="text-2xl font-semibold text-white mb-4">Loading albums...</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredAlbums.map((album, index) => (
                    <AlbumCard key={album.id} album={album} />
                  ))}
                </div>
              )}
              {!loading && filteredAlbums.length === 0 && (
                <div className="text-center py-16" data-aos="fade-up">
                  <Music className="w-20 h-20 mx-auto mb-6 text-zinc-600" />
                  <h3 className="text-2xl font-semibold text-white mb-4">No albums found</h3>
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
 