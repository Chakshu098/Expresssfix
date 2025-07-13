import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

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

    // Get user's design uploads count
    const { count: uploadsCount } = await supabaseClient
      .from('design_uploads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get user's analysis results count
    const { count: analysisCount } = await supabaseClient
      .from('ai_analysis_results')
      .select('design_uploads!inner(*)', { count: 'exact', head: true })
      .eq('design_uploads.user_id', user.id);

    // Get user's exports count
    const { count: exportsCount } = await supabaseClient
      .from('export_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get recent activity
    const { data: recentUploads } = await supabaseClient
      .from('design_uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: recentAnalysis } = await supabaseClient
      .from('ai_analysis_results')
      .select(`
        *,
        design_uploads!inner(*)
      `)
      .eq('design_uploads.user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Calculate average scores
    const avgScore = recentAnalysis?.length 
      ? Math.round(recentAnalysis.reduce((sum, analysis) => sum + (analysis.overall_score || 0), 0) / recentAnalysis.length)
      : 0;

    // Get today's activity
    const today = new Date().toISOString().split('T')[0];
    const { count: todayUploads } = await supabaseClient
      .from('design_uploads')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    const { count: todayAnalysis } = await supabaseClient
      .from('ai_analysis_results')
      .select('design_uploads!inner(*)', { count: 'exact', head: true })
      .eq('design_uploads.user_id', user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    return new Response(
      JSON.stringify({
        stats: {
          totalUploads: uploadsCount || 0,
          totalAnalysis: analysisCount || 0,
          totalExports: exportsCount || 0,
          averageScore: avgScore,
          todayUploads: todayUploads || 0,
          todayAnalysis: todayAnalysis || 0,
        },
        recentActivity: {
          uploads: recentUploads || [],
          analysis: recentAnalysis || [],
        },
        progressToday: {
          uploadsGoal: 10,
          analysisGoal: 20,
          uploadsCompleted: todayUploads || 0,
          analysisCompleted: todayAnalysis || 0,
        },
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