import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface UploadRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadType: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { fileName, fileType, fileSize, uploadType }: UploadRequest = await req.json();

    // Generate unique file path
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${user.id}/${uploadType}/${Date.now()}.${fileExt}`;

    // Create signed upload URL
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('design-files')
      .createSignedUploadUrl(uniqueFileName);

    if (uploadError) {
      throw uploadError;
    }

    // Save upload record to database
    const { data: designUpload, error: dbError } = await supabaseClient
      .from('design_uploads')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_url: `design-files/${uniqueFileName}`,
        file_size: fileSize,
        file_type: fileType,
        upload_type: uploadType,
      })
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    return new Response(
      JSON.stringify({
        uploadUrl: uploadData.signedUrl,
        uploadId: designUpload.id,
        filePath: uniqueFileName,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});