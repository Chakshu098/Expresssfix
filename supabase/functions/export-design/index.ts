import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface ExportRequest {
  uploadId?: string;
  format: 'PNG' | 'JPG' | 'PDF' | 'SVG';
  quality: 'high' | 'medium' | 'low';
  width?: number;
  height?: number;
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

    const { uploadId, format, quality, width, height }: ExportRequest = await req.json();

    // Simulate export processing
    const exportFileName = `enhanced-design-${Date.now()}.${format.toLowerCase()}`;
    const exportPath = `exports/${user.id}/${exportFileName}`;

    // In a real implementation, this would:
    // 1. Fetch the original design file
    // 2. Apply AI enhancements
    // 3. Convert to requested format
    // 4. Upload to storage
    
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a mock export URL (in real implementation, this would be the actual file)
    const mockExportUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/exports/${exportPath}`;

    // Save export record
    const { data: exportRecord, error: exportError } = await supabaseClient
      .from('export_history')
      .insert({
        user_id: user.id,
        design_upload_id: uploadId,
        export_format: format,
        export_quality: quality,
        file_url: mockExportUrl,
      })
      .select()
      .single();

    if (exportError) {
      throw exportError;
    }

    // Generate download URL
    const downloadUrl = mockExportUrl;

    return new Response(
      JSON.stringify({
        exportId: exportRecord.id,
        downloadUrl,
        fileName: exportFileName,
        format,
        quality,
        estimatedSize: getEstimatedSize(format, quality),
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

function getEstimatedSize(format: string, quality: string): string {
  const baseSizes = {
    PNG: { high: '2.5 MB', medium: '1.2 MB', low: '600 KB' },
    JPG: { high: '1.8 MB', medium: '800 KB', low: '400 KB' },
    PDF: { high: '3.2 MB', medium: '1.5 MB', low: '800 KB' },
    SVG: { high: '150 KB', medium: '100 KB', low: '50 KB' },
  };

  return baseSizes[format as keyof typeof baseSizes]?.[quality as keyof typeof baseSizes.PNG] || '1 MB';
}