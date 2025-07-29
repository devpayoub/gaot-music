"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Music, Image as ImageIcon, X, Plus, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface Track {
  name: string;
  file: File;
}

interface TrackUrl {
  name: string;
  url: string;
  duration: number;
}

export default function UploadAlbum() {
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumPrice, setAlbumPrice] = useState("");
  const [albumDuration, setAlbumDuration] = useState("");
  const [albumCover, setAlbumCover] = useState<File | null>(null);
  const [albumCoverPreview, setAlbumCoverPreview] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAlbumCover(file);
      setAlbumCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleTrackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newTracks = files.map(file => ({
      name: file.name,
      file: file
    }));
    setTracks([...tracks, ...newTracks]);
  };

  const removeTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!albumTitle || !albumCover || tracks.length === 0 || !userProfile) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    setIsUploading(true);
    setShowUploadSuccess(true);
    
    try {
      // 1. Upload album cover to Supabase Storage
      const coverFileName = `album-covers/${userProfile.id}/${Date.now()}-${albumCover.name}`;
      const { data: coverData, error: coverError } = await supabase.storage
        .from('album-covers')
        .upload(coverFileName, albumCover);

      if (coverError) {
        throw new Error(`Failed to upload cover: ${coverError.message}`);
      }

      // Get cover URL
      const { data: coverUrlData } = supabase.storage
        .from('album-covers')
        .getPublicUrl(coverFileName);

      // 2. Upload tracks to Supabase Storage
      const trackUrls: TrackUrl[] = [];
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const trackFileName = `tracks/${userProfile.id}/${Date.now()}-${i}-${track.file.name}`;
        
        const { data: trackData, error: trackError } = await supabase.storage
          .from('tracks')
          .upload(trackFileName, track.file);

        if (trackError) {
          throw new Error(`Failed to upload track ${track.name}: ${trackError.message}`);
        }

        // Get track URL
        const { data: trackUrlData } = supabase.storage
          .from('tracks')
          .getPublicUrl(trackFileName);

        trackUrls.push({
          name: track.name,
          url: trackUrlData.publicUrl,
          duration: 0 // You can calculate this if needed
        });
      }

      // 3. Save album to database
      const { data: albumData, error: albumError } = await supabase
        .from('albums')
        .insert([
          {
            title: albumTitle,
            artist_id: userProfile.id,
            cover_image_url: coverUrlData.publicUrl,
            price: albumPrice, 
            genre: 'Unknown',
            total_duration: albumDuration,
            release_year: new Date().getFullYear(),
            is_public: true
          }
        ])
        .select()
        .single();
      console.log('Album insert error:', albumError);
      if (albumError) {
        throw new Error(`Failed to save album: ${albumError.message}`);
      }

      // 4. Save tracks to database
      const tracksToInsert = trackUrls.map(track => ({
        album_id: albumData.id,
        title: track.name,
        audio_file_url: track.url,
        duration: track.duration,
        track_number: trackUrls.indexOf(track) + 1
      }));

      const { error: tracksError } = await supabase
        .from('tracks')
        .insert(tracksToInsert);

      if (tracksError) {
        throw new Error(`Failed to save tracks: ${tracksError.message}`);
      }

      // Success!
      toast({
        variant: "success",
        title: "Album Uploaded Successfully",
        description: `${albumTitle} has been uploaded with ${tracks.length} tracks.`,
      });

      // Reset form
      setTimeout(() => {
        setShowUploadSuccess(false);
        setAlbumTitle("");
        setAlbumPrice("");
        setAlbumDuration("");
        setAlbumCover(null);
        setAlbumCoverPreview("");
        setTracks([]);
      }, 2000);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "An unexpected error occurred during upload.",
      });
      setShowUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Card className="bg-[#17191D]">
        <CardContent className="py-8">
          <div className="space-y-6">
            {/* Album Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Album Title</label>
              <Input
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="Enter album title"
                className="bg-zinc-800/50"
              />
            </div>
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Album Price 'TND'</label>
                <Input
                  value={albumPrice}
                  onChange={(e) => setAlbumPrice(e.target.value)}
                  placeholder="Enter album price 'TND'"
                  className="bg-zinc-800/50"
                />
              </div>
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Album Duration</label>
                <Input
                  value={albumDuration}
                  onChange={(e) => setAlbumDuration(e.target.value)}
                  placeholder="Enter album duration 'minutes'"
                  className="bg-zinc-800/50"
                />
              </div>
            </div>
            {/* Album Cover Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Album Cover</label>
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4">
                {albumCoverPreview ? (
                  <div className="relative aspect-square w-48 mx-auto">
                    <Image
                      src={albumCoverPreview}
                      alt="Album cover preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setAlbumCover(null);
                        setAlbumCoverPreview("");
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-zinc-500" />
                    <span className="text-sm text-zinc-500">Click to upload album cover</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            {/* Tracks Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tracks</label>
              <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4">
                <div className="space-y-4">
                  {tracks.map((track, index) => (
                    <div key={index} className="flex items-center justify-between bg-zinc-800/50 p-2 rounded">
                      <span className="text-sm">{track.name}</span>
                      <button
                        onClick={() => removeTrack(index)}
                        className="p-1 hover:bg-zinc-700 rounded"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center justify-center gap-2 p-4 cursor-pointer hover:bg-zinc-800/30 rounded-lg">
                    <Plus className="w-5 h-5 text-zinc-500" />
                    <span className="text-sm text-zinc-500">Add tracks</span>
                    <input
                      type="file"
                      accept="audio/*"
                      multiple
                      onChange={handleTrackUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!albumTitle || !albumCover || tracks.length === 0}
              className="w-full bg-white hover:bg-white disabled:opacity-50"
            >
              Upload Album
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Upload success popup */}
      <Dialog open={showUploadSuccess} onOpenChange={setShowUploadSuccess}>
        <DialogContent className="bg-zinc-900 text-white flex flex-col items-center justify-center">
          <DialogTitle>
            <span className="sr-only">Album Upload Status</span>
          </DialogTitle>
          <div className="text-lg font-semibold mb-2">
            {isUploading ? "Uploading..." : "Album uploaded"}
          </div>
          <div className="text-6xl mb-4">
            {isUploading ? (
              <Loader2 className="animate-spin text-blue-500" />
            ) : (
              <CheckCircle className="text-green-500" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 