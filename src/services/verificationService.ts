import { supabase } from '@/lib/supabase';

export interface VerificationApplicationData {
  user_id: string;
  artist_name: string;
  bio: string;
  genre: string;
  location: string;
  social_links: {
    spotify?: string;
    soundcloud?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  portfolio_links: string[];
  experience_years: number;
  previous_releases?: string[];
  reason_for_verification: string;
}

export interface VerificationStatus {
  id: string;
  user_id: string;
  status: 'not_applied' | 'pending' | 'verified' | 'rejected';
  application_data: VerificationApplicationData;
  rejection_reason?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export class VerificationService {
  // Submit verification application
  static async submitApplication(data: VerificationApplicationData) {
    try {
      const { data: verification, error } = await supabase
        .from('artist_verifications')
        .insert([{
          user_id: data.user_id,
          status: 'pending',
          application_data: data
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: verification, error: null };
    } catch (error: any) {
      console.error('Error submitting verification application:', error);
      return { data: null, error: error.message };
    }
  }

  // Get verification status for user
  static async getVerificationStatus(userId: string) {
    try {
      const { data: verification, error } = await supabase
        .from('artist_verifications')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no verification record exists, return not_applied status
      if (!verification) {
        return {
          data: {
            id: '',
            user_id: userId,
            status: 'not_applied' as const,
            application_data: null,
            rejection_reason: null,
            verified_at: null,
            created_at: '',
            updated_at: ''
          },
          error: null
        };
      }

      return { data: verification, error: null };
    } catch (error: any) {
      console.error('Error getting verification status:', error);
      return { data: null, error: error.message };
    }
  }

  // Update verification application
  static async updateApplication(verificationId: string, data: Partial<VerificationApplicationData>) {
    try {
      const { data: verification, error } = await supabase
        .from('artist_verifications')
        .update({
          application_data: data,
          status: 'pending' // Reset to pending when updated
        })
        .eq('id', verificationId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: verification, error: null };
    } catch (error: any) {
      console.error('Error updating verification application:', error);
      return { data: null, error: error.message };
    }
  }

  // Cancel verification application
  static async cancelApplication(verificationId: string) {
    try {
      const { error } = await supabase
        .from('artist_verifications')
        .delete()
        .eq('id', verificationId);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error: any) {
      console.error('Error canceling verification application:', error);
      return { error: error.message };
    }
  }

  // Admin: Approve verification
  static async approveVerification(verificationId: string) {
    try {
      const { data: verification, error } = await supabase
        .from('artist_verifications')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString()
        })
        .eq('id', verificationId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update user type to Artist if not already
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ user_type: 'Artist' })
        .eq('id', verification.user_id);

      if (userUpdateError) {
        console.error('Error updating user type:', userUpdateError);
      }

      return { data: verification, error: null };
    } catch (error: any) {
      console.error('Error approving verification:', error);
      return { data: null, error: error.message };
    }
  }

  // Admin: Reject verification
  static async rejectVerification(verificationId: string, reason: string) {
    try {
      const { data: verification, error } = await supabase
        .from('artist_verifications')
        .update({
          status: 'rejected',
          rejection_reason: reason
        })
        .eq('id', verificationId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data: verification, error: null };
    } catch (error: any) {
      console.error('Error rejecting verification:', error);
      return { data: null, error: error.message };
    }
  }

  // Admin: Get all pending verifications
  static async getPendingVerifications() {
    try {
      const { data: verifications, error } = await supabase
        .from('artist_verifications')
        .select(`
          *,
          users!artist_verifications_user_id_fkey (
            id,
            full_name,
            email,
            profile_picture_url
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return { data: verifications, error: null };
    } catch (error: any) {
      console.error('Error getting pending verifications:', error);
      return { data: null, error: error.message };
    }
  }

  // Admin: Get all verifications with pagination
  static async getAllVerifications(page: number = 1, limit: number = 20, status?: string) {
    try {
      let query = supabase
        .from('artist_verifications')
        .select(`
          *,
          users!artist_verifications_user_id_fkey (
            id,
            full_name,
            email,
            profile_picture_url
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: verifications, error, count } = await query
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        throw error;
      }

      return { 
        data: verifications, 
        count: count || 0,
        error: null 
      };
    } catch (error: any) {
      console.error('Error getting all verifications:', error);
      return { data: null, count: 0, error: error.message };
    }
  }

  // Check if user is verified artist
  static async isVerifiedArtist(userId: string) {
    try {
      const { data: verification, error } = await supabase
        .from('artist_verifications')
        .select('status')
        .eq('user_id', userId)
        .eq('status', 'verified')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return { data: { isVerified: !!verification }, error: null };
    } catch (error: any) {
      console.error('Error checking if user is verified:', error);
      return { data: { isVerified: false }, error: error.message };
    }
  }

  // Get verification statistics
  static async getVerificationStats() {
    try {
      // Get counts for each status
      const { count: pendingCount } = await supabase
        .from('artist_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: verifiedCount } = await supabase
        .from('artist_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'verified');

      const { count: rejectedCount } = await supabase
        .from('artist_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      const { count: totalCount } = await supabase
        .from('artist_verifications')
        .select('*', { count: 'exact', head: true });

      return {
        data: {
          pending: pendingCount || 0,
          verified: verifiedCount || 0,
          rejected: rejectedCount || 0,
          total: totalCount || 0
        },
        error: null
      };
    } catch (error: any) {
      console.error('Error getting verification stats:', error);
      return { data: null, error: error.message };
    }
  }

  // Get verification by ID (admin only)
  static async getVerificationById(verificationId: string) {
    try {
      const { data: verification, error } = await supabase
        .from('artist_verifications')
        .select(`
          *,
          users!artist_verifications_user_id_fkey (
            id,
            full_name,
            email,
            profile_picture_url,
            bio,
            location,
            genre
          )
        `)
        .eq('id', verificationId)
        .single();

      if (error) {
        throw error;
      }

      return { data: verification, error: null };
    } catch (error: any) {
      console.error('Error getting verification by ID:', error);
      return { data: null, error: error.message };
    }
  }
} 