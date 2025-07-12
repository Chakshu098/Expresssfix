/*
  # Initial Schema for ExpressFix AI Design Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `design_uploads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `file_name` (text)
      - `file_url` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `upload_type` (text) - 'smart_fix', 'brand_check', 'typography', etc.
      - `created_at` (timestamp)
    
    - `ai_analysis_results`
      - `id` (uuid, primary key)
      - `design_upload_id` (uuid, references design_uploads)
      - `analysis_type` (text)
      - `overall_score` (integer)
      - `results` (jsonb)
      - `suggestions` (jsonb)
      - `created_at` (timestamp)
    
    - `brand_guidelines`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `colors` (jsonb)
      - `typography` (jsonb)
      - `logo_specs` (jsonb)
      - `spacing` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `export_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `design_upload_id` (uuid, references design_uploads)
      - `export_format` (text)
      - `export_quality` (text)
      - `file_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create design_uploads table
CREATE TABLE IF NOT EXISTS design_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  upload_type text NOT NULL DEFAULT 'smart_fix',
  created_at timestamptz DEFAULT now()
);

-- Create ai_analysis_results table
CREATE TABLE IF NOT EXISTS ai_analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  design_upload_id uuid REFERENCES design_uploads(id) ON DELETE CASCADE NOT NULL,
  analysis_type text NOT NULL,
  overall_score integer DEFAULT 0,
  results jsonb DEFAULT '{}',
  suggestions jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create brand_guidelines table
CREATE TABLE IF NOT EXISTS brand_guidelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  colors jsonb DEFAULT '{}',
  typography jsonb DEFAULT '{}',
  logo_specs jsonb DEFAULT '{}',
  spacing jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create export_history table
CREATE TABLE IF NOT EXISTS export_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  design_upload_id uuid REFERENCES design_uploads(id) ON DELETE CASCADE,
  export_format text NOT NULL,
  export_quality text NOT NULL,
  file_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_guidelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Design uploads policies
CREATE POLICY "Users can read own uploads"
  ON design_uploads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploads"
  ON design_uploads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own uploads"
  ON design_uploads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploads"
  ON design_uploads
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- AI analysis results policies
CREATE POLICY "Users can read own analysis results"
  ON ai_analysis_results
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM design_uploads 
      WHERE design_uploads.id = ai_analysis_results.design_upload_id 
      AND design_uploads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analysis results for own uploads"
  ON ai_analysis_results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM design_uploads 
      WHERE design_uploads.id = ai_analysis_results.design_upload_id 
      AND design_uploads.user_id = auth.uid()
    )
  );

-- Brand guidelines policies
CREATE POLICY "Users can manage own brand guidelines"
  ON brand_guidelines
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Export history policies
CREATE POLICY "Users can manage own export history"
  ON export_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_design_uploads_user_id ON design_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_design_uploads_created_at ON design_uploads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_results_design_upload_id ON ai_analysis_results(design_upload_id);
CREATE INDEX IF NOT EXISTS idx_brand_guidelines_user_id ON brand_guidelines(user_id);
CREATE INDEX IF NOT EXISTS idx_export_history_user_id ON export_history(user_id);