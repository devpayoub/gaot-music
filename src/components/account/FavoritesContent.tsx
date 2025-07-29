"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Music, Users, Play, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ArtistService } from "@/services/artistService";
import { AlbumService } from "@/services/albumService";

interface Artist {
  id: string;
  full_name: string;
  aka?: string;
  profile_picture_url?: string;
  bio?: string;
  location?: string;
  genre?: string;
}

interface Album {
  id: string;
  title: string;
  cover_image_url?: string;
  release_year: number;
  tracks?: any[];
  likes_count: number;
  users?: {
    id: string;
    full_name: string;
    aka?: string;
  };
}

export default function FavoritesContent() {
  const { userProfile } = useAuth();
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [likedAlbums, setLikedAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'artists' | 'albums'>('artists');

  useEffect(() => {
    if (!userProfile?.id) return;

    const loadFavorites = async () => {
      setLoading(true);
      try {
        console.log('Loading favorites for user:', userProfile.id);
        
        // Load followed artists
        const artistsResult = await ArtistService.getFollowedArtists(userProfile.id);
        console.log('Followed artists result:', artistsResult);
        if (artistsResult.data) {
          setFollowedArtists(artistsResult.data);
        }

        // Load liked albums using the new efficient method
        const likedAlbumsResult = await AlbumService.getUserLikedAlbums(userProfile.id);
        console.log('Liked albums result:', likedAlbumsResult);
        if (likedAlbumsResult.data) {
          setLikedAlbums(likedAlbumsResult.data);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [userProfile?.id]);

  const unfollowArtist = async (artistId: string) => {
    if (!userProfile?.id) return;

    try {
      const result = await ArtistService.toggleFollowArtist(userProfile.id, artistId);
      if (result.data && !result.data.following) {
        setFollowedArtists(prev => prev.filter(artist => artist.id !== artistId));
      }
    } catch (error) {
      console.error('Error unfollowing artist:', error);
    }
  };

  const unlikeAlbum = async (albumId: string) => {
    if (!userProfile?.id) return;

    try {
      const result = await AlbumService.toggleAlbumLike(userProfile.id, albumId);
      if (result.data && !result.data.liked) {
        setLikedAlbums(prev => prev.filter(album => album.id !== albumId));
      }
    } catch (error) {
      console.error('Error unliking album:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-zinc-400">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-zinc-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('artists')}
          className={`flex-1 py-3 px-6 rounded-md text-sm md:text-base font-medium transition-colors ${
            activeTab === 'artists'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
          Followed Artists ({followedArtists.length})
        </button>
        <button
          onClick={() => setActiveTab('albums')}
          className={`flex-1 py-3 px-6 rounded-md text-sm md:text-base font-medium transition-colors ${
            activeTab === 'albums'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
          Liked Albums ({likedAlbums.length})
        </button>
      </div>

      {/* Followed Artists Tab */}
      {activeTab === 'artists' && (
        <div>
          {followedArtists.length === 0 ? (
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                <CardTitle className="text-white mb-2">No Followed Artists</CardTitle>
                <CardDescription className="text-zinc-400 mb-4">
                  You haven't followed any artists yet. Start exploring and follow your favorite artists!
                </CardDescription>
                <Link href="/artists">
                  <Button className="bg-white text-black hover:bg-gray-200">
                    Discover Artists
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {followedArtists.map((artist) => (
    <Card key={artist.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4">
            <Image
              src={artist.profile_picture_url || "/default-avatar.png"}
              alt={artist.full_name}
              fill
              className="object-cover"
            />
          </div>
          <CardTitle className="text-white text-lg md:text-xl mb-1 truncate">
            {artist.full_name}
          </CardTitle>
          {artist.aka && (
            <p className="text-zinc-400 text-sm md:text-base mb-2">AKA {artist.aka}</p>
          )}
          {artist.location && (
            <div className="flex items-center text-zinc-500 text-sm mb-4 justify-center">
              <MapPin className="w-4 h-4 mr-2" />
              {artist.location}
            </div>
          )}

          {/* Buttons below name & picture */}
          <div className="flex flex-col sm:flex-row gap-2 w-full justify-center mt-2">
            <Link href={`/artists/${encodeURIComponent(artist.aka || artist.full_name)}`} className="w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                className="text-xs md:text-sm w-full sm:w-auto"
              >
                View Profile
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              onClick={() => unfollowArtist(artist.id)}
              className="text-xs md:text-sm text-red-400 border-red-400 hover:bg-red-400/10 w-full sm:w-auto"
            >
              Unfollow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

          )}
        </div>
      )}

      {/* Liked Albums Tab */}
      {activeTab === 'albums' && (
        <div>
          {likedAlbums.length === 0 ? (
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardContent className="p-8 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                <CardTitle className="text-white mb-2">No Liked Albums</CardTitle>
                <CardDescription className="text-zinc-400 mb-4">
                  You haven't liked any albums yet. Start exploring and like your favorite albums!
                </CardDescription>
                <Link href="/albums">
                  <Button className="bg-white text-black hover:bg-gray-200">
                    Discover Albums
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {likedAlbums.map((album) => (
                <Card key={album.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800/70 transition-colors">
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
                      <h3 className="font-semibold text-white mb-1 truncate">{album.title}</h3>
                      {album.users && (
                        <p className="text-sm text-zinc-400 mb-1">
                          {album.users.full_name}
                          {album.users.aka && ` (${album.users.aka})`}
                        </p>
                      )}
                      <p className="text-sm text-zinc-400">{album.release_year} • {album.tracks?.length || 0} tracks</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-red-500">
                        <Heart className="w-4 h-4 fill-red-500" />
                        {album.likes_count?.toLocaleString() ?? 0}
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/albums/${encodeURIComponent(album.title)}`}>
                          <Button size="sm" className="bg-white text-black hover:bg-gray-200 text-xs">
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unlikeAlbum(album.id)}
                          className="text-xs text-red-400 border-red-400 hover:bg-red-400/10"
                        >
                          Unlike
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 