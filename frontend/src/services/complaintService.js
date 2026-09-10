import apiClient from './apiClient';

export const complaintService = {
  getAllComplaints: async (params = {}) => {
    const response = await apiClient.get('/api/complaints', { params });
    return response.data;
  },
  getComplaintById: async (id) => {
    const response = await apiClient.get(`/api/complaints/${id}`);
    return response.data;
  },
  getStudentComplaints: async (studentId) => {
    const response = await apiClient.get(`/api/complaints/student/${studentId}`);
    return response.data;
  },
  createComplaint: async (data) => {
    const response = await apiClient.post('/api/complaints', data);
    return response.data;
  },
  updateStatus: async (id, payload) => {
    const response = await apiClient.patch(`/api/complaints/${id}/status`, payload);
    return response.data;
  },
  deleteComplaint: async (id) => {
    const response = await apiClient.delete(`/api/complaints/${id}`);
    return response.data;
  },
};
