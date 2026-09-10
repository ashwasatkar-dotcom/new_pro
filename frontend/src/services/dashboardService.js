import apiClient from './apiClient';

export const dashboardService = {
  getWardenStats: async () => {
    const response = await apiClient.get('/api/dashboard/warden');
    return response.data;
  },
  getStudentStats: async () => {
    const response = await apiClient.get('/api/dashboard/student');
    return response.data;
  },
};
