"use client";

import React, { useState, useEffect } from "react";
import { AlbumService } from "@/services/albumService";

export default function DebugAlbumsPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const { data, error } = await AlbumService.getAllAlbums();
        
        if (error) {
          console.error('Error fetching albums:', error);
        } else {
          setAlbums(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Albums</h1>
        <p>Loading albums...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Albums</h1>
      <p className="mb-4">Total albums: {albums.length}</p>
      
      <div className="space-y-4">
        {albums.map((album) => (
          <div key={album.id} className="bg-gray-800 p-4 rounded">
            <h3 className="font-bold">ID: {album.id}</h3>
            <p><strong>Title:</strong> {album.title}</p>
            <p><strong>Artist ID:</strong> {album.artist_id}</p>
            <p><strong>Is Public:</strong> {album.is_public ? 'Yes' : 'No'}</p>
            <p><strong>Created:</strong> {album.created_at}</p>
            <a 
              href={`/albums/${encodeURIComponent(album.title)}`}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Test Link: /albums/{encodeURIComponent(album.title)}
            </a>
          </div>
        ))}
      </div>
      
      {albums.length === 0 && (
        <div className="bg-red-900 p-4 rounded">
          <p>No albums found in database!</p>
        </div>
      )}
    </div>
  );
} 