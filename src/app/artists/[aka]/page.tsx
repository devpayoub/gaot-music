"use client";

import React, { useEffect, useState } from "react";
import { use } from "react";
import { Heart, Music, Users, MapPin, Calendar, Play, Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useAuth } from '@/contexts/AuthContext';
import { ArtistService } from "@/services/artistService";
import { AlbumService } from "@/services/albumService";

export default function ArtistProfilePage({ params }: { params: Promise<{ aka: string }> }) {
  const { aka } = use(params);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowed, setIsFollowed] = useState(false);
  const [likedAlbums, setLikedAlbums] = useState<string[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const { requireAuth, userProfile } = useAuth();

  useEffect(() => {
    setLoading(true);
    ArtistService.getArtistWithAlbumsByAka(aka).then(res => {
      if (res.data) {
        setArtist(res.data);
        setFollowersCount(res.data.stats?.followersCount || 0);
        setLoading(false);
      }
    });
  }, [aka]);

  // Check if user follows this artist and which albums they like
  useEffect(() => {
    if (!userProfile?.id || !artist?.id) return;

    // Check follow status
    ArtistService.checkFollowArtist(userProfile.id, artist.id).then(res => {
      if (res.data) {
        setIsFollowed(res.data.following);
      }
    });

    // Check liked albums
    const checkLikedAlbums = async () => {
      if (artist.albums) {
        const likedAlbumIds: string[] = [];
        for (const album of artist.albums) {
          const likeCheck = await AlbumService.checkAlbumLike(userProfile.id, album.id);
          if (likeCheck.data?.liked) {
            likedAlbumIds.push(album.id);
          }
        }
        setLikedAlbums(likedAlbumIds);
      }
    };
    checkLikedAlbums();
  }, [userProfile?.id, artist?.id, artist?.albums]);

  const toggleFollow = async () => {
    if (!requireAuth('follow artist')) return;
    if (!userProfile?.id || !artist?.id) return;

    try {
      const result = await ArtistService.toggleFollowArtist(userProfile.id, artist.id);
      if (result.data) {
        setIsFollowed(result.data.following);
        // Update follower count
        setFollowersCount(prev => result.data.following ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const toggleAlbumLike = async (albumId: string) => {
    if (!requireAuth('like album')) return;
    if (!userProfile?.id) return;

    try {
      const result = await AlbumService.toggleAlbumLike(userProfile.id, albumId);
      if (result.data) {
        setLikedAlbums(prev => 
          result.data.liked 
            ? [...prev, albumId]
            : prev.filter(id => id !== albumId)
        );
        
        // Update the album's likes count in the artist data
        setArtist((prev: any) => ({
          ...prev,
          albums: prev.albums.map((album: any) => 
            album.id === albumId 
              ? { ...album, likes_count: result.data.liked ? (album.likes_count || 0) + 1 : Math.max(0, (album.likes_count || 0) - 1) }
              : album
          )
        }));
      }
    } catch (error) {
      console.error('Error toggling album like:', error);
    }
  };

  if (loading) return <div className="text-center py-16 text-white">Loading...</div>;
  if (!artist) return <div className="text-center py-16 text-white">Artist not found</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121315] via-[#17191D] to-[#1a1c20]">
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Artist Header */}
            <div className="flex flex-col lg:flex-row items-start gap-8 mb-12">
              {/* Profile Picture */}
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full overflow-hidden mx-auto lg:mx-0">
                <Image
                  src={artist.profile_picture_url || "/default-avatar.png"}
                  alt={artist.full_name || "Artist profile picture"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Artist Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                    {artist.full_name}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <p className="text-xl text-zinc-400">AKA {artist.aka}</p>
                    {artist.isVerified && (
                      <Image
                        src="/b-blue.svg"
                        alt="Verified"
                        width={20}
                        height={20}
                        className="ml-1"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                    <div className="flex items-center space-x-1 text-zinc-400">
                      <MapPin className="w-4 h-4" />
                      <span>{artist.location}</span>
                    </div>
                    <span className="bg-zinc-700 px-3 py-1 rounded-full text-sm">RAP</span>
                  </div>
                </div>

                {/* Follow Button */}
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <button
                    onClick={toggleFollow}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-colors ${
                      isFollowed
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-white hover:bg-gray-200 text-black'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFollowed ? 'fill-white' : ''}`} />
                    {isFollowed ? 'Following' : 'Follow'}
                  </button>
                  <div className="text-sm text-zinc-400">
                    <span className="text-white font-medium">{followersCount.toLocaleString()}</span> followers
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <a href={`https://instagram.com/${artist.social_links?.instagram || ''}`} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <Instagram className="w-5 h-5 text-pink-500" />
                  </a>
                  <a href={`https://twitter.com/${artist.social_links?.twitter || ''}`} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </a>
                  <a href={`https://facebook.com/${artist.social_links?.facebook || ''}`} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </a>
                  <a href={`https://youtube.com/${artist.social_links?.youtube || ''}`} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <Youtube className="w-5 h-5 text-red-500" />
                  </a>
                  <a href={`https://open.spotify.com/artist/${artist.social_links?.spotify || ''}`} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
                    <Image
                      src="/spotify.png"
                      alt="Spotify"
                      width={20}
                      height={20}
                      className="w-5 h-5 text-green-500"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Bio */}
            <Card className="bg-zinc-800/50 border-zinc-700 mb-12">
              <CardContent className="p-6">
                <CardTitle className="text-white mb-4">About</CardTitle>
                <p className="text-zinc-300 leading-relaxed">{artist.bio}</p>
              </CardContent>
            </Card>

            {/* Albums Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8">Albums</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {artist.albums?.map((album: any) => (
                  <Card key={album.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-colors">
                    <CardContent className="p-4">
                      <div className="relative aspect-square mb-4">
                        <Image
                          src={album.cover_image_url || "/albums/default.jpg"}
                          alt={album.title || "Album cover"}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors">
                          <Play className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-semibold text-white mb-1">{album.title}</h3>
                        <p className="text-sm text-zinc-400">{album.release_year} • {album.tracks?.length || 0} tracks</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleAlbumLike(album.id)}
                          className={`flex items-center gap-1 text-sm ${
                            likedAlbums.includes(album.id) ? 'text-red-500' : 'text-zinc-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedAlbums.includes(album.id) ? 'fill-red-500' : ''}`} />
                          {album.likes_count?.toLocaleString() ?? 0}
                        </button>
                        <Link href={`/albums/${encodeURIComponent(album.title)}`}>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-200">
                            View Album
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6 text-center">
                  <Music className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <CardTitle className="text-2xl text-white">{artist.albumCount ?? artist.albums?.length ?? 0}</CardTitle>
                  <CardDescription className="text-zinc-400">Albums Released</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <CardTitle className="text-2xl text-white">{followersCount.toLocaleString()}</CardTitle>
                  <CardDescription className="text-zinc-400">Total Followers</CardDescription>
                </CardContent>
              </Card>
              <Card className="bg-zinc-800/50 border-zinc-700">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <CardTitle className="text-2xl text-white">2010</CardTitle>
                  <CardDescription className="text-zinc-400">Since</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 