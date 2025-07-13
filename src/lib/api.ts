import { supabase } from './supabase';

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json',
  };
};

// Upload Design API
export const uploadAPI = {
  async createUpload(fileName: string, fileType: string, fileSize: number, uploadType: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/upload-design`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ fileName, fileType, fileSize, uploadType }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create upload');
    }
    
    return response.json();
  },

  async uploadFile(uploadUrl: string, file: File) {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    return response;
  },
};

// Analysis API
export const analysisAPI = {
  async analyzeDesign(uploadId: string, analysisType: 'smart_fix' | 'brand_check' | 'typography' | 'ai_suggestions') {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/analyze-design`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uploadId, analysisType }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze design');
    }
    
    return response.json();
  },
};

// Brand Guidelines API
export const brandAPI = {
  async getGuidelines() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/brand-guidelines`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch brand guidelines');
    }
    
    return response.json();
  },

  async createGuideline(data: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/brand-guidelines`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create brand guideline');
    }
    
    return response.json();
  },

  async updateGuideline(id: string, data: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/brand-guidelines?id=${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update brand guideline');
    }
    
    return response.json();
  },

  async deleteGuideline(id: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/brand-guidelines?id=${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete brand guideline');
    }
    
    return response.json();
  },
};

// Export API
export const exportAPI = {
  async exportDesign(uploadId: string, format: string, quality: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/export-design`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uploadId, format, quality }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to export design');
    }
    
    return response.json();
  },
};

// Analytics API
export const analyticsAPI = {
  async getUserAnalytics() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/user-analytics`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    return response.json();
  },
};

// Notifications API
export const notificationsAPI = {
  async getNotifications() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    
    return response.json();
  },

  async markAsRead(notificationId: string) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/notifications?id=${notificationId}&action=mark_read`, {
      method: 'PUT',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
    
    return response.json();
  },

  async markAllAsRead() {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/notifications?action=mark_all_read`, {
      method: 'PUT',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
    
    return response.json();
  },
};

// AI Enhancement API
export const enhanceAPI = {
  async enhanceDesign(uploadId: string, enhancements: string[], settings?: any) {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/ai-enhance`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ uploadId, enhancements, settings }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to enhance design');
    }
    
    return response.json();
  },
};