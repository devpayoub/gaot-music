import { supabase } from '@/lib/supabase';

export interface CreateAlbumData {
  artist_id: string;
  title: string;
  description?: string;
  genre: string;
  release_year: number;
  price: number;
  is_public?: boolean;
}

export interface UpdateAlbumData {
  title?: string;
  description?: string;
  genre?: string;
  release_year?: number;
  price?: number;
  is_public?: boolean;
}

export interface CreateTrackData {
  album_id: string;
  title: string;
  duration: number; // in seconds
  track_number: number;
  is_explicit?: boolean;
}

export interface UpdateTrackData {
  title?: string;
  duration?: number;
  track_number?: number;
  is_explicit?: boolean;
}

export class AlbumService {
  // Create a new album
  static async createAlbum(data: CreateAlbumData) {
    try {
      const { data: album, error } = await supabase
        .from('albums')
        .insert([data])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: album, error: null };
    } catch (error: any) {
      console.error('Error creating album:', error);
      return { data: null, error: error.message };
    }
  }

  // Update album
  static async updateAlbum(albumId: string, data: UpdateAlbumData) {
    try {
      const { data: album, error } = await supabase
        .from('albums')
        .update(data)
        .eq('id', albumId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: album, error: null };
    } catch (error: any) {
      console.error('Error updating album:', error);
      return { data: null, error: error.message };
    }
  }

  // Delete album
  static async deleteAlbum(albumId: string) {
    try {
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', albumId);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting album:', error);
      return { error: error.message };
    }
  }

  // Get all albums (for debugging)
  static async getAllAlbums() {
    try {
      const { data: albums, error } = await supabase
        .from('albums')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data: albums, error: null };
    } catch (error: any) {
      console.error('Error getting all albums:', error);
      return { data: null, error: error.message };
    }
  }

  // Get album by title with tracks
  static async getAlbumByTitle(albumTitle: string) {
    try {
      console.log('AlbumService.getAlbumByTitle called with:', albumTitle);
      
      const { data: album, error: albumError } = await supabase
        .from('albums')
        .select(`
          *,
          tracks (*),
          users!albums_artist_id_fkey (
            id,
            full_name,
            aka,
            profile_picture_url
          )
        `)
        .eq('title', albumTitle)
        .eq('is_public', true)
        .single();

      console.log('Supabase query result:', { album, albumError });

      if (albumError) {
        throw albumError;
      }

      // Double check: if album exists but is not public, return null
      if (album && !album.is_public) {
        console.log('Album found but is private, returning null');
        return { data: null, error: 'Album not found' };
      }

      return { data: album, error: null };
    } catch (error: any) {
      console.error('Error getting album by title:', error);
      return { data: null, error: error.message };
    }
  }

  // Get album by ID with tracks (keeping for backward compatibility)
  static async getAlbumById(albumId: string) {
    try {
      const { data: album, error: albumError } = await supabase
        .from('albums')
        .select(`
          *,
          tracks (*),
          users!albums_artist_id_fkey (
            id,
            full_name,
            aka,
            profile_picture_url
          )
        `)
        .eq('id', albumId)
        .eq('is_public', true)
        .single();

      if (albumError) {
        throw albumError;
      }

      // Double check: if album exists but is not public, return null
      if (album && !album.is_public) {
        console.log('Album found but is private, returning null');
        return { data: null, error: 'Album not found' };
      }

      return { data: album, error: null };
    } catch (error: any) {
      console.error('Error getting album:', error);
      return { data: null, error: error.message };
    }
  }

  // Get albums by artist
  static async getAlbumsByArtist(artistId: string) {
    try {
      const { data: albums, error } = await supabase
        .from('albums')
        .select(`
          *,
          tracks (*)
        `)
        .eq('artist_id', artistId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data: albums, error: null };
    } catch (error: any) {
      console.error('Error getting artist albums:', error);
      return { data: null, error: error.message };
    }
  }

  // Get all public albums with pagination
  static async getPublicAlbums(page: number = 1, limit: number = 20, search?: string) {
    try {
      let query = supabase
        .from('albums')
        .select(`
          *,
          users!albums_artist_id_fkey (
            id,
            full_name,
            aka
          )
        `, { count: 'exact' })
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data: albums, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        throw error;
      }

      return { 
        data: albums, 
        count: count || 0,
        error: null 
      };
    } catch (error: any) {
      console.error('Error getting public albums:', error);
      return { data: null, count: 0, error: error.message };
    }
  }

  // Upload album cover
  static async uploadAlbumCover(albumId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${albumId}-${Date.now()}.${fileExt}`;
      const filePath = `album-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('album-covers')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('album-covers')
        .getPublicUrl(filePath);

      // Update album with new cover URL
      const { error: updateError } = await supabase
        .from('albums')
        .update({ cover_image_url: publicUrl })
        .eq('id', albumId);

      if (updateError) {
        throw updateError;
      }

      return { data: publicUrl, error: null };
    } catch (error: any) {
      console.error('Error uploading album cover:', error);
      return { data: null, error: error.message };
    }
  }

  // Upload track audio file
  static async uploadTrackAudio(trackId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${trackId}-${Date.now()}.${fileExt}`;
      const filePath = `track-audio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('track-audio')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('track-audio')
        .getPublicUrl(filePath);

      // Update track with new audio URL
      const { error: updateError } = await supabase
        .from('tracks')
        .update({ audio_file_url: publicUrl })
        .eq('id', trackId);

      if (updateError) {
        throw updateError;
      }

      return { data: publicUrl, error: null };
    } catch (error: any) {
      console.error('Error uploading track audio:', error);
      return { data: null, error: error.message };
    }
  }

  // Create track
  static async createTrack(data: CreateTrackData) {
    try {
      const { data: track, error } = await supabase
        .from('tracks')
        .insert([data])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: track, error: null };
    } catch (error: any) {
      console.error('Error creating track:', error);
      return { data: null, error: error.message };
    }
  }

  // Update track
  static async updateTrack(trackId: string, data: UpdateTrackData) {
    try {
      const { data: track, error } = await supabase
        .from('tracks')
        .update(data)
        .eq('id', trackId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: track, error: null };
    } catch (error: any) {
      console.error('Error updating track:', error);
      return { data: null, error: error.message };
    }
  }

  // Delete track
  static async deleteTrack(trackId: string) {
    try {
      const { error } = await supabase
        .from('tracks')
        .delete()
        .eq('id', trackId);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting track:', error);
      return { error: error.message };
    }
  }

  // Get popular albums
  static async getPopularAlbums(limit: number = 10) {
    try {
      const { data: albums, error } = await supabase
        .from('albums')
        .select(`
          *,
          users!albums_artist_id_fkey (
            id,
            full_name,
            aka
          )
        `)
        .eq('is_public', true)
        .order('likes_count', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return { data: albums, error: null };
    } catch (error: any) {
      console.error('Error getting popular albums:', error);
      return { data: null, error: error.message };
    }
  }

  // Get new releases
  static async getNewReleases(limit: number = 10) {
    try {
      const currentYear = new Date().getFullYear();
      const { data: albums, error } = await supabase
        .from('albums')
        .select(`
          *,
          users!albums_artist_id_fkey (
            id,
            full_name,
            aka
          )
        `)
        .eq('is_public', true)
        .eq('release_year', currentYear)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return { data: albums, error: null };
    } catch (error: any) {
      console.error('Error getting new releases:', error);
      return { data: null, error: error.message };
    }
  }

  // Toggle album like
  static async toggleAlbumLike(userId: string, albumId: string) {
    try {
      console.log('AlbumService.toggleAlbumLike called with:', { userId, albumId });
      
      // Check if user already liked the album
      const { data: existingLike, error: checkError } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', userId)
        .eq('target_id', albumId)
        .eq('target_type', 'album')
        .eq('interaction_type', 'like')
        .single();

      console.log('Check existing like result:', { existingLike, checkError });

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Unlike
        console.log('Removing existing like');
        const { error: deleteError } = await supabase
          .from('user_interactions')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          throw deleteError;
        }

        // Get current like count and decrement it
        const { data: currentAlbum, error: fetchError } = await supabase
          .from('albums')
          .select('likes_count')
          .eq('id', albumId)
          .single();

        if (!fetchError && currentAlbum) {
          const newCount = Math.max(0, (currentAlbum.likes_count || 0) - 1);
          const { error: updateError } = await supabase
            .from('albums')
            .update({ likes_count: newCount })
            .eq('id', albumId);

          if (updateError) {
            console.error('Error updating like count:', updateError);
          }
        }

        return { data: { liked: false }, error: null };
      } else {
        // Like
        console.log('Adding new like');
        const { error: insertError } = await supabase
          .from('user_interactions')
          .insert([{
            user_id: userId,
            target_id: albumId,
            target_type: 'album',
            interaction_type: 'like'
          }]);

        if (insertError) {
          throw insertError;
        }

        // Get current like count and increment it
        const { data: currentAlbum, error: fetchError } = await supabase
          .from('albums')
          .select('likes_count')
          .eq('id', albumId)
          .single();

        if (!fetchError && currentAlbum) {
          const newCount = (currentAlbum.likes_count || 0) + 1;
          const { error: updateError } = await supabase
            .from('albums')
            .update({ likes_count: newCount })
            .eq('id', albumId);

          if (updateError) {
            console.error('Error updating like count:', updateError);
          }
        }

        return { data: { liked: true }, error: null };
      }
    } catch (error: any) {
      console.error('Error toggling album like:', error);
      return { data: null, error: error.message };
    }
  }

  // Check if user liked album
  static async checkAlbumLike(userId: string, albumId: string) {
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', userId)
        .eq('target_id', albumId)
        .eq('target_type', 'album')
        .eq('interaction_type', 'like')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { data: { liked: !!data }, error: null };
    } catch (error: any) {
      console.error('Error checking album like:', error);
      return { data: { liked: false }, error: error.message };
    }
  }

  // Get user's liked albums
  static async getUserLikedAlbums(userId: string) {
    try {
      console.log('AlbumService.getUserLikedAlbums called with userId:', userId);
      
      // First, get all the album IDs that the user has liked
      const { data: likedInteractions, error } = await supabase
        .from('user_interactions')
        .select('target_id')
        .eq('user_id', userId)
        .eq('target_type', 'album')
        .eq('interaction_type', 'like');

      console.log('Liked interactions query result:', { likedInteractions, error });

      if (error) {
        throw error;
      }

      if (!likedInteractions || likedInteractions.length === 0) {
        console.log('No liked albums found');
        return { data: [], error: null };
      }

      // Extract the album IDs
      const albumIds = likedInteractions.map(interaction => interaction.target_id);
      console.log('Album IDs to fetch:', albumIds);

      // Fetch the album details for each ID
      const { data: albums, error: albumsError } = await supabase
        .from('albums')
        .select(`
          id,
          title,
          cover_image_url,
          release_year,
          likes_count,
          users!albums_artist_id_fkey (
            id,
            full_name,
            aka
          )
        `)
        .in('id', albumIds)
        .eq('is_public', true);

      console.log('Albums query result:', { albums, albumsError });

      if (albumsError) {
        throw albumsError;
      }

      return { data: albums || [], error: null };
    } catch (error: any) {
      console.error('Error getting user liked albums:', error);
      return { data: null, error: error.message };
    }
  }
} 