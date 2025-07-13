import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EnhanceRequest {
  uploadId: string;
  enhancements: string[];
  settings?: {
    preserveOriginal?: boolean;
    enhancementLevel?: 'subtle' | 'moderate' | 'aggressive';
  };
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

    const { uploadId, enhancements, settings }: EnhanceRequest = await req.json();

    // Get original upload
    const { data: upload, error: uploadError } = await supabaseClient
      .from('design_uploads')
      .select('*')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single();

    if (uploadError || !upload) {
      throw new Error('Upload not found');
    }

    // Simulate AI enhancement processing
    const enhancementResults = {
      originalFile: upload.file_url,
      enhancedFile: `enhanced/${upload.file_url}`,
      appliedEnhancements: enhancements,
      processingTime: Math.floor(Math.random() * 3000) + 1000, // 1-4 seconds
      improvements: {
        contrast: Math.floor(Math.random() * 20) + 10, // 10-30% improvement
        alignment: Math.floor(Math.random() * 25) + 15, // 15-40% improvement
        spacing: Math.floor(Math.random() * 15) + 10, // 10-25% improvement
        typography: Math.floor(Math.random() * 20) + 5, // 5-25% improvement
      },
      beforeAfterComparison: {
        overallScore: {
          before: Math.floor(Math.random() * 20) + 60, // 60-80
          after: Math.floor(Math.random() * 15) + 85, // 85-100
        },
      },
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, enhancementResults.processingTime));

    // Create enhanced upload record
    const enhancedFileName = `enhanced_${upload.file_name}`;
    const { data: enhancedUpload, error: enhancedError } = await supabaseClient
      .from('design_uploads')
      .insert({
        user_id: user.id,
        file_name: enhancedFileName,
        file_url: enhancementResults.enhancedFile,
        file_size: upload.file_size,
        file_type: upload.file_type,
        upload_type: 'enhanced',
      })
      .select()
      .single();

    if (enhancedError) {
      throw enhancedError;
    }

    // Save enhancement record
    const { data: enhancementRecord, error: recordError } = await supabaseClient
      .from('ai_analysis_results')
      .insert({
        design_upload_id: enhancedUpload.id,
        analysis_type: 'enhancement',
        overall_score: enhancementResults.beforeAfterComparison.overallScore.after,
        results: {
          originalUploadId: uploadId,
          enhancements: enhancementResults,
          settings,
        },
        suggestions: [`Enhanced with ${enhancements.length} AI improvements`],
      })
      .select()
      .single();

    if (recordError) {
      throw recordError;
    }

    return new Response(
      JSON.stringify({
        enhancementId: enhancementRecord.id,
        enhancedUploadId: enhancedUpload.id,
        enhancedFileUrl: enhancementResults.enhancedFile,
        results: enhancementResults,
        downloadReady: true,
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