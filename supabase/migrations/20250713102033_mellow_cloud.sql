/*
  # Create Storage Buckets for ExpressFix

  1. Storage Buckets
    - `design-files` - For original design uploads
    - `exports` - For processed/exported files
    - `enhanced` - For AI-enhanced designs
  
  2. Security
    - Enable RLS on all buckets
    - Users can only access their own files
    - Public read access for exports (with signed URLs)
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('design-files', 'design-files', false),
  ('exports', 'exports', false),
  ('enhanced', 'enhanced', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for design-files bucket
CREATE POLICY "Users can upload their own design files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'design-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own design files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'design-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own design files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'design-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own design files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'design-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for exports bucket
CREATE POLICY "Users can upload their own exports"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'exports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own exports"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'exports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for enhanced bucket
CREATE POLICY "Users can upload their own enhanced files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'enhanced' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own enhanced files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'enhanced' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );