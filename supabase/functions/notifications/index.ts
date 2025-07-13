import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
};

interface NotificationRequest {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  userId?: string;
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

    switch (req.method) {
      case 'GET':
        // Get user notifications (mock data for now)
        const mockNotifications = [
          {
            id: '1',
            title: 'Design Analysis Complete',
            message: 'Your landing page analysis is ready with 5 suggestions',
            type: 'success',
            unread: true,
            created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
          },
          {
            id: '2',
            title: 'Brand Check Alert',
            message: 'Logo placement needs adjustment in your design',
            type: 'warning',
            unread: true,
            created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
          },
          {
            id: '3',
            title: 'Export Ready',
            message: 'Your enhanced design is ready for download',
            type: 'info',
            unread: false,
            created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          },
        ];

        return new Response(JSON.stringify(mockNotifications), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'POST':
        const { title, message, type }: NotificationRequest = await req.json();
        
        // In a real implementation, this would save to a notifications table
        const newNotification = {
          id: Date.now().toString(),
          title,
          message,
          type,
          unread: true,
          created_at: new Date().toISOString(),
          user_id: user.id,
        };

        return new Response(JSON.stringify(newNotification), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        // Mark notifications as read
        const url = new URL(req.url);
        const notificationId = url.searchParams.get('id');
        const action = url.searchParams.get('action');

        if (action === 'mark_read') {
          // In a real implementation, this would update the notification in the database
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (action === 'mark_all_read') {
          // In a real implementation, this would mark all user notifications as read
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        throw new Error('Invalid action');

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