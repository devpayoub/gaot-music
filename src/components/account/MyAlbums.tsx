"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Music, Eye, EyeOff, Trash2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Track {
  name: string;
  file: File;
}

interface Album {
  id: string;
  title: string;
  cover: string;
  tracks: Track[];
  isVisible: boolean;
  price?: number;
  duration?: number;
}

export default function MyAlbums() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<string | null>(null);
  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!userProfile) return;
      const { data, error } = await supabase
        .from("albums")
        .select("id, title, cover_image_url, is_public, price, total_duration")
        .eq("artist_id", userProfile.id)
        .order("created_at", { ascending: false });
      if (data) {
        const albumsWithTracks = await Promise.all(
          data.map(async (album: any) => {
            const { count } = await supabase
              .from("tracks")
              .select("id", { count: "exact", head: true })
              .eq("album_id", album.id);
            return {
              id: album.id,
              title: album.title,
              cover: album.cover_image_url,
              tracks: Array(count || 0).fill({}), // Just for count
              isVisible: album.is_public,
              price: album.price,
              duration: album.total_duration,
            };
          })
        );
        setAlbums(albumsWithTracks);
      }
    };
    fetchAlbums();
  }, [userProfile]);

  const toggleAlbumVisibility = async (albumId: string) => {
    // Find the album
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    const newVisibility = !album.isVisible;
    // Update in database
    const { error } = await supabase
      .from("albums")
      .update({ is_public: newVisibility })
      .eq("id", albumId);
    if (!error) {
      setAlbums(albums.map(album =>
        album.id === albumId
          ? { ...album, isVisible: newVisibility }
          : album
      ));
    }
  };

  const deleteAlbum = (albumId: string) => {
    setAlbums(albums.filter(album => album.id !== albumId));
    setDeleteDialogOpen(false);
    setAlbumToDelete(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My albums</h1>
        <Button
          onClick={() => window.location.href = "/account?tab=Upload Album"}
          className="bg-white hover:bg-white"
        >
          Add Album
        </Button>
      </div>
      {albums.length === 0 ? (
        <Card className="bg-[#17191D]">
          <CardContent className="py-16">
            <div className="text-center">
              <Music className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
              <CardTitle className="mb-2">No albums found</CardTitle>
              <CardDescription className="mb-6">Get started by adding your first album</CardDescription>
              <Button
                onClick={() => window.location.href = "/account?tab=Upload Album"}
                className="bg-white hover:bg-white"
              >
                Add Album
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <Card key={album.id} className="bg-[#17191D] overflow-hidden group">
                <div className="w-full aspect-square relative">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    className={`object-cover transition-opacity duration-200 ${!album.isVisible ? 'opacity-50' : ''}`}
                  />
                  {/* Control buttons overlay */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAlbumVisibility(album.id);
                      }}
                      className="p-2 bg-black/50 hover:bg-black/75 rounded-full transition-colors"
                    >
                      {album.isVisible ? (
                        <Eye className="w-4 h-4 text-white" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAlbumToDelete(album.id);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-2 bg-black/50 hover:bg-red-600/75 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white mb-1">{album.title}</h3>
                      <p className="text-sm text-zinc-500">{album.tracks.length} tracks</p>
                      {album.price !== undefined && (
                        <p className="text-sm text-zinc-400">Price: {album.price} TND</p>
                      )}
                      {album.duration !== undefined && (
                        <p className="text-sm text-zinc-400">Duration: {album.duration} min</p>
                      )}
                    </div>
                    {!album.isVisible && (
                      <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
                        Hidden
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
              <DialogHeader>
                <DialogTitle>Delete Album</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Are you sure you want to delete this album? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setAlbumToDelete(null);
                  }}
                  className="hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => albumToDelete && deleteAlbum(albumToDelete)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete Album
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
} 