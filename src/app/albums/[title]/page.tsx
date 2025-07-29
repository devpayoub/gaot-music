"use client";

import React, { useState, useEffect } from "react";
import { Heart, Play, ShoppingCart, Clock, Music, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useAuth } from '@/contexts/AuthContext';
import { AlbumService } from "@/services/albumService";
import { supabase } from "@/lib/supabase";
import { use } from "react";

export default function AlbumPage({ params }: { params: Promise<{ title: string }> }) {
  const { title } = use(params);
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<number | null>(null);
  const { requireAuth, userProfile } = useAuth();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        setLoading(true);
        // Decode the title from URL
        const decodedTitle = decodeURIComponent(title);
        console.log('Fetching album with title:', decodedTitle);
        
        const { data, error } = await AlbumService.getAlbumByTitle(decodedTitle);
        
        console.log('AlbumService response:', { data, error });
        
        if (error) {
          console.error('Error fetching album:', error);
          setAlbum(null);
        } else {
          setAlbum(data);
        }
      } catch (error) {
        console.error('Error:', error);
        setAlbum(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [title]);

  // Check if user has liked this album
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!userProfile?.id || !album?.id) return;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: existingLike, error } = await supabase
          .from('user_interactions')
          .select('id')
          .eq('user_id', userProfile.id)
          .eq('target_id', album.id)
          .eq('target_type', 'album')
          .eq('interaction_type', 'like')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking like status:', error);
          return;
        }

        setIsLiked(!!existingLike);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };

    checkIfLiked();
  }, [userProfile?.id, album?.id]);

  const toggleLike = async () => {
    console.log('=== ALBUM LIKE DEBUG ===');
    console.log('User profile:', userProfile);
    console.log('Album ID:', album?.id);
    
    if (!userProfile?.id) {
      console.error('No user profile or user ID');
      return;
    }

    if (!album?.id) {
      console.error('No album ID');
      return;
    }

    if (!requireAuth('like album')) {
      console.error('Auth check failed');
      return;
    }

    console.log('Toggling album like for album:', album.id, 'user:', userProfile.id);

    try {
      const result = await AlbumService.toggleAlbumLike(userProfile.id, album.id);
      console.log('Toggle album like result:', result);
      
      if (result.error) {
        console.error('AlbumService returned error:', result.error);
        return;
      }
      
      if (result.data) {
        console.log('Updating UI state...');
        setIsLiked(result.data.liked);
        
        // Update the album's like count
        if (result.data.liked) {
          setAlbum((prev: any) => prev ? { ...prev, likes_count: (prev.likes_count || 0) + 1 } : prev);
        } else {
          setAlbum((prev: any) => prev ? { ...prev, likes_count: Math.max(0, (prev.likes_count || 0) - 1) } : prev);
        }
        
        console.log('Like process completed successfully!');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBuyAlbum = () => {
    if (!requireAuth('buy album')) {
      return;
    }
    console.log(`Buying album ${album?.title}`);
  };

  const playTrack = (trackId: number) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#121315] via-[#17191D] to-[#1a1c20] flex items-center justify-center">
          <div className="text-center">
            <Music className="w-20 h-20 mx-auto mb-6 text-zinc-600 animate-spin" />
            <h3 className="text-2xl font-semibold text-white mb-4">Loading album...</h3>
          </div>
        </div>
      </>
    );
  }

  if (!album) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#121315] via-[#17191D] to-[#1a1c20] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">Album not found</h3>
            <Link href="/albums">
              <Button className="bg-white text-black hover:bg-gray-200">
                Back to Albums
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121315] via-[#17191D] to-[#1a1c20]">
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Album Header */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12">
              {/* Album Cover */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96 mx-auto lg:mx-0">
                <Image
                  src={album.cover_image_url || "/albums/default.jpg"}
                  alt={album.title}
                  fill
                  className="object-cover rounded-lg shadow-2xl"
                />
                <button className="absolute bottom-4 right-4 p-4 bg-white rounded-full hover:bg-gray-200 transition-colors shadow-lg">
                  <Play className="w-6 h-6 text-black" />
                </button>
              </div>

              {/* Album Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {album.title}
                  </h1>
                  <Link href={`/artists/${album.users?.aka || album.users?.id}`}>
                    <p className="text-xl text-zinc-400 mb-4 hover:text-white transition-colors">
                      by {album.users?.aka || "Unknown Artist"}
                    </p>
                  </Link>
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                    <div className="flex items-center space-x-1 text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      <span>{album.release_year}</span>
                    </div>
                    <span className="bg-zinc-700 px-3 py-1 rounded-full text-sm">{album.genre}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                      isLiked
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </button>
                  <Button 
                    className="bg-white text-black hover:bg-gray-200 px-6 py-3"
                    onClick={handleBuyAlbum}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Buy ${album.price || 0}
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-zinc-400">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{(album.likes_count || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Music className="w-4 h-4" />
                    <span>{album.tracks?.length || 0} tracks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{album.total_duration || 0} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {album.description && (
              <Card className="bg-zinc-800/50 border-zinc-700 mb-12">
                <CardContent className="p-6">
                  <CardTitle className="text-white mb-4">About this album</CardTitle>
                  <p className="text-zinc-300 leading-relaxed">{album.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Tracks */}
            {album.tracks && album.tracks.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Tracks</h2>
                <Card className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-0">
                    {album.tracks.map((track: any, index: number) => (
                      <div
                        key={track.id}
                        className={`flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors ${
                          index !== album.tracks.length - 1 ? 'border-b border-zinc-700' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => playTrack(track.id)}
                            className="p-2 rounded-full hover:bg-zinc-700 transition-colors"
                          >
                            {playingTrack === track.id ? (
                              <div className="w-4 h-4 bg-white rounded-sm"></div>
                            ) : (
                              <Play className="w-4 h-4 text-zinc-400" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-medium">{track.title}</span>
                              {track.is_explicit && (
                                <span className="bg-zinc-700 text-zinc-300 text-xs px-1 rounded">E</span>
                              )}
                            </div>
                            <p className="text-sm text-zinc-400">{track.duration || '0:00'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 rounded-full hover:bg-zinc-700 transition-colors">
                            <Heart className="w-4 h-4 text-zinc-400" />
                          </button>
                          <button className="p-2 rounded-full hover:bg-zinc-700 transition-colors">
                            <ShoppingCart className="w-4 h-4 text-zinc-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Related Albums */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">More from {album.users?.full_name || "Artist"}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* You can add related albums here */}
                <Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-colors">
                  <CardContent className="p-4">
                    <div className="relative aspect-square mb-4">
                      <Image
                        src="/albums/default.jpg"
                        alt="Related Album"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-semibold text-white mb-1">Related Album</h3>
                    <p className="text-sm text-zinc-400">2024 • 12 tracks</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 