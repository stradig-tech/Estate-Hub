import apiClient from './apiClient';

export const authService = {
    login: async (email, password) => {
        const response = await apiClient.post('auth/login/', { username: email, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    },
    
    register: async (email, password) => {
        const response = await apiClient.post('auth/register/', { email, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },
    
    getMe: async () => {
        const response = await apiClient.get('auth/me/');
        return response.data;
    },
    
    updateMe: async (data) => {
        const response = await apiClient.patch('auth/me/', data);
        return response.data;
    }
};

export const propertyService = {
    list: async (params = {}) => {
        const response = await apiClient.get('properties/', { params });
        return response.data;
    },
    
    get: async (id) => {
        const response = await apiClient.get(`properties/${id}/`);
        return response.data;
    },
    
    create: async (data) => {
        const response = await apiClient.post('properties/', data);
        return response.data;
    },
    
    update: async (id, data) => {
        const response = await apiClient.patch(`properties/${id}/`, data);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await apiClient.delete(`properties/${id}/`);
        return response.data;
    }
};

export const userService = {
    list: async (params = {}) => {
        const response = await apiClient.get('users/', { params });
        return response.data;
    },
    
    get: async (id) => {
        const response = await apiClient.get(`users/${id}/`);
        return response.data;
    }
};

export const favoriteService = {
    list: async (params = {}) => {
        const response = await apiClient.get('favorites/', { params });
        return response.data;
    },
    
    create: async (data) => {
        const response = await apiClient.post('favorites/', data);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await apiClient.delete(`favorites/${id}/`);
        return response.data;
    }
};

export const reviewService = {
    list: async (params = {}) => {
        const response = await apiClient.get('reviews/', { params });
        return response.data;
    },
    
    create: async (data) => {
        const response = await apiClient.post('reviews/', data);
        return response.data;
    }
};

export const inquiryService = {
    list: async (params = {}) => {
        const response = await apiClient.get('inquiries/', { params });
        return response.data;
    },
    
    create: async (data) => {
        const response = await apiClient.post('inquiries/', data);
        return response.data;
    }
};

export const invoiceService = {
    list: async (params = {}) => {
        const response = await apiClient.get('invoices/', { params });
        return response.data;
    },
    
    create: async (data) => {
        const response = await apiClient.post('invoices/', data);
        return response.data;
    }
};

export const subscriptionPlanService = {
    list: async () => {
        const response = await apiClient.get('subscription-plans/');
        return response.data;
    }
};

export const nearbyPlaceService = {
    list: async (params = {}) => {
        const response = await apiClient.get('nearby-places/', { params });
        return response.data;
    }
};

export const cmsService = {
    getMenus: async () => {
        const response = await apiClient.get('cms/menus/');
        return response.data;
    },
    getSettings: async () => {
        const response = await apiClient.get('cms/settings/');
        return response.data;
    },
    getPageContent: async (slug) => {
        const response = await apiClient.get(`cms/pages/${slug}/`);
        return response.data;
    },
    getBlogs: async () => {
        const response = await apiClient.get('cms/blogs/');
        return response.data;
    },
    getBlogBySlug: async (slug) => {
        const response = await apiClient.get(`cms/blogs/${slug}/`);
        return response.data;
    }
};
