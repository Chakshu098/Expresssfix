import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DesignUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  upload_type: string;
  created_at: string;
}

export interface AIAnalysisResult {
  id: string;
  design_upload_id: string;
  analysis_type: string;
  overall_score: number;
  results: any;
  suggestions: string[];
  created_at: string;
}

export interface BrandGuideline {
  id: string;
  user_id: string;
  name: string;
  colors: any;
  typography: any;
  logo_specs: any;
  spacing: any;
  created_at: string;
  updated_at: string;
}

export interface ExportHistory {
  id: string;
  user_id: string;
  design_upload_id?: string;
  export_format: string;
  export_quality: string;
  file_url?: string;
  created_at: string;
}