import { supabase } from './supabase';
import type { Profile, DesignUpload, AIAnalysisResult, BrandGuideline, ExportHistory } from './supabase';

// Profile operations
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data;
  }
};

// Design upload operations
export const designUploadService = {
  async createUpload(upload: Omit<DesignUpload, 'id' | 'created_at'>): Promise<DesignUpload | null> {
    const { data, error } = await supabase
      .from('design_uploads')
      .insert(upload)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating upload:', error);
      return null;
    }
    
    return data;
  },

  async getUserUploads(userId: string, uploadType?: string): Promise<DesignUpload[]> {
    let query = supabase
      .from('design_uploads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (uploadType) {
      query = query.eq('upload_type', uploadType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching uploads:', error);
      return [];
    }
    
    return data || [];
  },

  async deleteUpload(uploadId: string): Promise<boolean> {
    const { error } = await supabase
      .from('design_uploads')
      .delete()
      .eq('id', uploadId);
    
    if (error) {
      console.error('Error deleting upload:', error);
      return false;
    }
    
    return true;
  }
};

// AI analysis operations
export const analysisService = {
  async saveAnalysis(analysis: Omit<AIAnalysisResult, 'id' | 'created_at'>): Promise<AIAnalysisResult | null> {
    const { data, error } = await supabase
      .from('ai_analysis_results')
      .insert(analysis)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving analysis:', error);
      return null;
    }
    
    return data;
  },

  async getAnalysisForUpload(uploadId: string): Promise<AIAnalysisResult[]> {
    const { data, error } = await supabase
      .from('ai_analysis_results')
      .select('*')
      .eq('design_upload_id', uploadId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching analysis:', error);
      return [];
    }
    
    return data || [];
  },

  async getUserAnalysisHistory(userId: string): Promise<(AIAnalysisResult & { design_upload: DesignUpload })[]> {
    const { data, error } = await supabase
      .from('ai_analysis_results')
      .select(`
        *,
        design_upload:design_uploads(*)
      `)
      .eq('design_uploads.user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching analysis history:', error);
      return [];
    }
    
    return data || [];
  }
};

// Brand guidelines operations
export const brandGuidelineService = {
  async createGuideline(guideline: Omit<BrandGuideline, 'id' | 'created_at' | 'updated_at'>): Promise<BrandGuideline | null> {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .insert(guideline)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating brand guideline:', error);
      return null;
    }
    
    return data;
  },

  async getUserGuidelines(userId: string): Promise<BrandGuideline[]> {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching brand guidelines:', error);
      return [];
    }
    
    return data || [];
  },

  async updateGuideline(guidelineId: string, updates: Partial<BrandGuideline>): Promise<BrandGuideline | null> {
    const { data, error } = await supabase
      .from('brand_guidelines')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', guidelineId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating brand guideline:', error);
      return null;
    }
    
    return data;
  }
};

// Export history operations
export const exportService = {
  async saveExport(exportData: Omit<ExportHistory, 'id' | 'created_at'>): Promise<ExportHistory | null> {
    const { data, error } = await supabase
      .from('export_history')
      .insert(exportData)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving export:', error);
      return null;
    }
    
    return data;
  },

  async getUserExports(userId: string): Promise<ExportHistory[]> {
    const { data, error } = await supabase
      .from('export_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching exports:', error);
      return [];
    }
    
    return data || [];
  }
};

// Authentication helpers
export const authService = {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }
};