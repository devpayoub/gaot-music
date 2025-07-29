import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface UpdateUserProfileData {
  full_name?: string;
  aka?: string;
  bio?: string;
  location?: string;
  genre?: string;
  social_links?: any;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailData {
  newEmail: string;
  password: string;
}

export class UserService {
  private static toast = useToast();

  // Update user profile information
  static async updateProfile(userId: string, data: UpdateUserProfileData) {
    try {
      const { data: updatedProfile, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: updatedProfile, error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { data: null, error: error.message };
    }
  }

  // Update user password
  static async updatePassword(currentPassword: string, newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error updating password:', error);
      return { error: error.message };
    }
  }

  // Update user email
  static async updateEmail(newEmail: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error updating email:', error);
      return { error: error.message };
    }
  }

  // Upload profile picture
  static async uploadProfilePicture(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user profile with new picture URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return { data: publicUrl, error: null };
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      return { data: null, error: error.message };
    }
  }

  // Delete profile picture
  static async deleteProfilePicture(userId: string, currentPictureUrl: string) {
    try {
      // Extract file path from URL
      const urlParts = currentPictureUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `profile-pictures/${fileName}`;

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (deleteError) {
        throw deleteError;
      }

      // Update user profile to remove picture URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture_url: null })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting profile picture:', error);
      return { error: error.message };
    }
  }

  // Get user profile by ID
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return { data: null, error: error.message };
    }
  }

  // Get user statistics
  static async getUserStats(userId: string) {
    try {
      // Get user's albums count
      const { count: albumsCount } = await supabase
        .from('albums')
        .select('*', { count: 'exact', head: true })
        .eq('artist_id', userId);

      // Get user's followers count
      const { count: followersCount } = await supabase
        .from('user_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('target_id', userId)
        .eq('target_type', 'artist')
        .eq('interaction_type', 'follow');

      // Get user's total likes received
      const { count: likesReceived } = await supabase
        .from('user_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('target_id', userId)
        .eq('interaction_type', 'like');

      return {
        data: {
          albumsCount: albumsCount || 0,
          followersCount: followersCount || 0,
          likesReceived: likesReceived || 0,
        },
        error: null
      };
    } catch (error: any) {
      console.error('Error getting user stats:', error);
      return { data: null, error: error.message };
    }
  }

  // Delete user account
  static async deleteAccount(userId: string) {
    try {
      // Delete user profile from database
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }

      // Delete user from auth (this will also delete the profile due to CASCADE)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        throw authError;
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting account:', error);
      return { error: error.message };
    }
  }
} 