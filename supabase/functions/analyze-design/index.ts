import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AnalysisRequest {
  uploadId: string;
  analysisType: 'smart_fix' | 'brand_check' | 'typography' | 'ai_suggestions';
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

    const { uploadId, analysisType }: AnalysisRequest = await req.json();

    // Get upload details
    const { data: upload, error: uploadError } = await supabaseClient
      .from('design_uploads')
      .select('*')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single();

    if (uploadError || !upload) {
      throw new Error('Upload not found');
    }

    // Simulate AI analysis based on type
    let analysisResults;
    let overallScore;
    let suggestions: string[] = [];

    switch (analysisType) {
      case 'smart_fix':
        overallScore = Math.floor(Math.random() * 30) + 70; // 70-100
        analysisResults = {
          contrast: Math.floor(Math.random() * 20) + 80,
          alignment: Math.floor(Math.random() * 30) + 70,
          spacing: Math.floor(Math.random() * 25) + 75,
          typography: Math.floor(Math.random() * 20) + 80,
          issues: [
            { type: 'contrast', severity: 'medium', message: 'Some text elements have low contrast' },
            { type: 'spacing', severity: 'low', message: 'Inconsistent padding detected' },
            { type: 'alignment', severity: 'high', message: 'Elements not aligned to grid' }
          ]
        };
        suggestions = [
          'Increase text contrast by 15% for better readability',
          'Apply consistent 16px spacing between elements',
          'Align all elements to a 12-column grid system'
        ];
        break;

      case 'brand_check':
        overallScore = Math.floor(Math.random() * 25) + 75; // 75-100
        analysisResults = {
          colorCompliance: Math.floor(Math.random() * 20) + 80,
          fontCompliance: Math.floor(Math.random() * 30) + 70,
          logoCompliance: Math.floor(Math.random() * 15) + 85,
          spacingCompliance: Math.floor(Math.random() * 25) + 75,
          violations: [
            { category: 'colors', severity: 'medium', message: 'Non-brand color detected in CTA button' },
            { category: 'typography', severity: 'low', message: 'Font weight inconsistent with brand guidelines' }
          ]
        };
        suggestions = [
          'Replace #FF5733 with brand primary color #8B5CF6',
          'Use brand font weight 600 for all headings',
          'Maintain minimum 24px clear space around logo'
        ];
        break;

      case 'typography':
        overallScore = Math.floor(Math.random() * 20) + 80; // 80-100
        analysisResults = {
          hierarchy: Math.floor(Math.random() * 20) + 80,
          readability: Math.floor(Math.random() * 15) + 85,
          consistency: Math.floor(Math.random() * 25) + 75,
          lineHeight: Math.floor(Math.random() * 10) + 90,
          detectedFonts: ['Inter', 'Arial', 'Helvetica'],
          fontSizes: {
            h1: '32px',
            h2: '24px',
            h3: '20px',
            body: '16px'
          }
        };
        suggestions = [
          'Use consistent font family throughout design',
          'Increase line height to 1.6 for better readability',
          'Establish clearer font size hierarchy'
        ];
        break;

      case 'ai_suggestions':
        overallScore = Math.floor(Math.random() * 30) + 70; // 70-100
        analysisResults = {
          layoutScore: Math.floor(Math.random() * 25) + 75,
          colorScore: Math.floor(Math.random() * 20) + 80,
          contentScore: Math.floor(Math.random() * 30) + 70,
          categories: {
            layout: [
              { title: 'Grid Alignment', impact: 'high', effort: 'medium' },
              { title: 'Visual Balance', impact: 'medium', effort: 'low' }
            ],
            colors: [
              { title: 'Color Harmony', impact: 'high', effort: 'low' },
              { title: 'Contrast Enhancement', impact: 'high', effort: 'medium' }
            ]
          }
        };
        suggestions = [
          'Implement 12-column grid system for better alignment',
          'Adjust color palette for improved visual harmony',
          'Optimize white space distribution',
          'Enhance call-to-action visibility'
        ];
        break;

      default:
        throw new Error('Invalid analysis type');
    }

    // Save analysis results
    const { data: analysis, error: analysisError } = await supabaseClient
      .from('ai_analysis_results')
      .insert({
        design_upload_id: uploadId,
        analysis_type: analysisType,
        overall_score: overallScore,
        results: analysisResults,
        suggestions: suggestions,
      })
      .select()
      .single();

    if (analysisError) {
      throw analysisError;
    }

    return new Response(
      JSON.stringify({
        analysisId: analysis.id,
        overallScore,
        results: analysisResults,
        suggestions,
        analysisType,
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