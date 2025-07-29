import { supabase } from '@/lib/supabase';

export interface ArtistProfile {
  id: string;
  full_name: string;
  aka?: string;
  bio?: string;
  profile_picture_url?: string;
  location?: string;
  genre?: string;
  social_links?: any;
  user_type: 'Artist';
  created_at: string;
  updated_at: string;
}

export interface ArtistStats {
  followersCount: number;
  albumsCount: number;
  totalLikes: number;
  totalPlays: number;
}

export class ArtistService {
  // Get all artists with pagination and search
  static async getArtists(page: number = 1, limit: number = 20, search?: string) {
    try {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('user_type', 'Artist')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,aka.ilike.%${search}%`);
      }

      const { data: artists, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        throw error;
      }

      return { 
        data: artists, 
        count: count || 0,
        error: null 
      };
    } catch (error: any) {
      console.error('Error getting artists:', error);
      return { data: null, count: 0, error: error.message };
    }
  }

  // Get artist by ID with full profile
  static async getArtistById(artistId: string) {
    try {
      const { data: artist, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', artistId)
        .eq('user_type', 'Artist')
        .single();

      if (error) {
        throw error;
      }

      return { data: artist, error: null };
    } catch (error: any) {
      console.error('Error getting artist:', error);
      return { data: null, error: error.message };
    }
  }

  // Get artist with albums and stats
  static async getArtistWithAlbums(artistId: string) {
    try {
      // Get artist profile
      const { data: artist, error: artistError } = await supabase
        .from('users')
        .select('*')
        .eq('id', artistId)
        .eq('user_type', 'Artist')
        .single();

      if (artistError) {
        throw artistError;
      }

      // Get artist's albums
      const { data: albums, error: albumsError } = await supabase
        .from('albums')
        .select(`
          *,
          tracks (*)
        `)
        .eq('artist_id', artistId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (albumsError) {
        throw albumsError;
      }

      // Get artist stats
      const stats = await this.getArtistStats(artistId);

      return { 
        data: { 
          artist, 
          albums: albums || [], 
          stats: stats.data 
        }, 
        error: null 
      };
    } catch (error: any) {
      console.error('Error getting artist with albums:', error);
      return { data: null, error: error.message };
    }
  }

  // Get artist with albums by aka
  static async getArtistWithAlbumsByAka(aka: string) {
    try {
      // Get artist by aka
      const { data: artist, error: artistError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          aka,
          bio,
          profile_picture_url,
          location,
          genre,
          social_links,
          user_type,
          created_at,
          updated_at
        `)
        .eq('aka', aka)
        .eq('user_type', 'Artist')
        .single();

      if (artistError) {
        throw artistError;
      }

      // Get artist's albums
      const { data: albums, error: albumsError } = await supabase
        .from('albums')
        .select(`
          id,
          title,
          description,
          cover_image_url,
          release_year,
          genre,
          price,
          likes_count,
          total_duration,
          is_public,
          created_at,
          tracks (
            id,
            title,
            duration,
            track_number,
            is_explicit
          )
        `)
        .eq('artist_id', artist.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (albumsError) {
        throw albumsError;
      }

      // Get verification status
      const { data: verification, error: verificationError } = await supabase
        .from('artist_verifications')
        .select('status')
        .eq('user_id', artist.id)
        .single();

      // Optionally, get stats if needed
      const stats = await this.getArtistStats(artist.id);

      return {
        data: {
          ...artist,
          albums: albums || [],
          stats: stats.data,
          isVerified: verification?.status === 'verified'
        },
        error: null
      };
    } catch (error: any) {
      console.error('Error getting artist with albums by aka:', error);
      return { data: null, error: error.message };
    }
  }

  // Get artist statistics
  static async getArtistStats(artistId: string) {
    try {
      // Get followers count
      const { count: followersCount } = await supabase
        .from('user_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('target_id', artistId)
        .eq('target_type', 'artist')
        .eq('interaction_type', 'follow');

      // Get albums count
      const { count: albumsCount } = await supabase
        .from('albums')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', artistId)
        .eq('is_public', true);

      // Get total likes on all albums
      const { data: albums } = await supabase
        .from('albums')
        .select('likes_count')
        .eq('artist_id', artistId)
        .eq('is_public', true);

      const totalLikes = albums?.reduce((sum, album) => sum + (album.likes_count || 0), 0) || 0;

      return {
        data: {
          followersCount: followersCount || 0,
          albumsCount: albumsCount || 0,
          totalLikes,
          totalPlays: 0, // This would be calculated from actual play data
        },
        error: null
      };
    } catch (error: any) {
      console.error('Error getting artist stats:', error);
      return { data: null, error: error.message };
    }
  }

  // Toggle follow artist
  static async toggleFollowArtist(userId: string, artistId: string) {
    try {
      // Check if user already follows the artist
      const { data: existingFollow, error: checkError } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', userId)
        .eq('target_id', artistId)
        .eq('target_type', 'artist')
        .eq('interaction_type', 'follow')
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingFollow) {
        // Unfollow
        const { error: deleteError } = await supabase
          .from('user_interactions')
          .delete()
          .eq('id', existingFollow.id);

        if (deleteError) {
          throw deleteError;
        }

        return { data: { following: false }, error: null };
      } else {
        // Follow
        const { error: insertError } = await supabase
          .from('user_interactions')
          .insert([{
            user_id: userId,
            target_id: artistId,
            target_type: 'artist',
            interaction_type: 'follow'
          }]);

        if (insertError) {
          throw insertError;
        }

        return { data: { following: true }, error: null };
      }
    } catch (error: any) {
      console.error('Error toggling follow artist:', error);
      return { data: null, error: error.message };
    }
  }

  // Check if user follows artist
  static async checkFollowArtist(userId: string, artistId: string) {
    try {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('id')
        .eq('user_id', userId)
        .eq('target_id', artistId)
        .eq('target_type', 'artist')
        .eq('interaction_type', 'follow')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { data: { following: !!data }, error: null };
    } catch (error: any) {
      console.error('Error checking follow artist:', error);
      return { data: { following: false }, error: error.message };
    }
  }

  // Get user's followed artists
  static async getFollowedArtists(userId: string) {
    try {
      // First, get all the artist IDs that the user follows
      const { data: followedInteractions, error } = await supabase
        .from('user_interactions')
        .select('target_id')
        .eq('user_id', userId)
        .eq('target_type', 'artist')
        .eq('interaction_type', 'follow');

      if (error) {
        throw error;
      }

      if (!followedInteractions || followedInteractions.length === 0) {
        return { data: [], error: null };
      }

      // Extract the artist IDs
      const artistIds = followedInteractions.map(interaction => interaction.target_id);

      // Fetch the artist details for each ID
      const { data: artists, error: artistsError } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          aka,
          profile_picture_url,
          bio,
          location,
          genre
        `)
        .in('id', artistIds)
        .eq('user_type', 'Artist');

      if (artistsError) {
        throw artistsError;
      }

      return { data: artists || [], error: null };
    } catch (error: any) {
      console.error('Error getting followed artists:', error);
      return { data: null, error: error.message };
    }
  }

  // Get popular artists (most followed)
  static async getPopularArtists(limit: number = 10) {
    try {
      // This is a simplified version. In a real app, you might want to cache this data
      const { data: artists, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'Artist')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      // Get follower counts for each artist
      const artistsWithStats = await Promise.all(
        artists.map(async (artist) => {
          const stats = await this.getArtistStats(artist.id);
          return {
            ...artist,
            stats: stats.data
          };
        })
      );

      // Sort by follower count
      artistsWithStats.sort((a, b) => (b.stats?.followersCount || 0) - (a.stats?.followersCount || 0));

      return { data: artistsWithStats, error: null };
    } catch (error: any) {
      console.error('Error getting popular artists:', error);
      return { data: null, error: error.message };
    }
  }

  // Get trending artists (artists with recent activity)
  static async getTrendingArtists(limit: number = 10) {
    try {
      // Get artists with recent album releases
      const { data: recentAlbums, error: albumsError } = await supabase
        .from('albums')
        .select(`
          artist_id,
          created_at,
          users!albums_artist_id_fkey (
            id,
            full_name,
            aka,
            profile_picture_url,
            bio,
            location,
            genre
          )
        `)
        .eq('is_public', true)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .order('created_at', { ascending: false })
        .limit(limit * 2); // Get more to account for duplicates

      if (albumsError) {
        throw albumsError;
      }

      // Remove duplicates and get unique artists
      const uniqueArtists = recentAlbums?.reduce((acc, album) => {
        const user = album.users as any;
        if (!acc.find(artist => artist.id === user?.id)) {
          acc.push(user);
        }
        return acc;
      }, [] as any[]);

      return { data: uniqueArtists?.slice(0, limit) || [], error: null };
    } catch (error: any) {
      console.error('Error getting trending artists:', error);
      return { data: null, error: error.message };
    }
  }

  // Search artists
  static async searchArtists(query: string, limit: number = 20) {
    try {
      const { data: artists, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'Artist')
        .or(`full_name.ilike.%${query}%,aka.ilike.%${query}%,bio.ilike.%${query}%`)
        .order('full_name')
        .limit(limit);

      if (error) {
        throw error;
      }

      return { data: artists, error: null };
    } catch (error: any) {
      console.error('Error searching artists:', error);
      return { data: null, error: error.message };
    }
  }

  // Get artists by genre
  static async getArtistsByGenre(genre: string, limit: number = 20) {
    try {
      const { data: artists, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'Artist')
        .ilike('genre', `%${genre}%`)
        .order('full_name')
        .limit(limit);

      if (error) {
        throw error;
      }

      return { data: artists, error: null };
    } catch (error: any) {
      console.error('Error getting artists by genre:', error);
      return { data: null, error: error.message };
    }
  }

  // Get artists by location
  static async getArtistsByLocation(location: string, limit: number = 20) {
    try {
      const { data: artists, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'Artist')
        .ilike('location', `%${location}%`)
        .order('full_name')
        .limit(limit);

      if (error) {
        throw error;
      }

      return { data: artists, error: null };
    } catch (error: any) {
      console.error('Error getting artists by location:', error);
      return { data: null, error: error.message };
    }
  }
} 