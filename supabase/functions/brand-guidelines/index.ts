import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface BrandGuidelineRequest {
  name: string;
  colors?: any;
  typography?: any;
  logoSpecs?: any;
  spacing?: any;
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

    const url = new URL(req.url);
    const guidelineId = url.searchParams.get('id');

    switch (req.method) {
      case 'GET':
        if (guidelineId) {
          // Get specific guideline
          const { data, error } = await supabaseClient
            .from('brand_guidelines')
            .select('*')
            .eq('id', guidelineId)
            .eq('user_id', user.id)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all user guidelines
          const { data, error } = await supabaseClient
            .from('brand_guidelines')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        const createData: BrandGuidelineRequest = await req.json();
        
        const { data: newGuideline, error: createError } = await supabaseClient
          .from('brand_guidelines')
          .insert({
            user_id: user.id,
            name: createData.name,
            colors: createData.colors || {},
            typography: createData.typography || {},
            logo_specs: createData.logoSpecs || {},
            spacing: createData.spacing || {},
          })
          .select()
          .single();

        if (createError) throw createError;

        return new Response(JSON.stringify(newGuideline), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        if (!guidelineId) {
          throw new Error('Guideline ID required for update');
        }

        const updateData: Partial<BrandGuidelineRequest> = await req.json();
        
        const { data: updatedGuideline, error: updateError } = await supabaseClient
          .from('brand_guidelines')
          .update({
            ...updateData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', guidelineId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify(updatedGuideline), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        if (!guidelineId) {
          throw new Error('Guideline ID required for deletion');
        }

        const { error: deleteError } = await supabaseClient
          .from('brand_guidelines')
          .delete()
          .eq('id', guidelineId)
          .eq('user_id', user.id);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Method not allowed');
    }
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