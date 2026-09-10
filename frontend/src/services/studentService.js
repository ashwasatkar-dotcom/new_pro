import apiClient from './apiClient';

export const studentService = {
  getAllStudents: async (params = {}) => {
    const response = await apiClient.get('/api/students', { params });
    return response.data;
  },
  getStudentById: async (id) => {
    const response = await apiClient.get(`/api/students/${id}`);
    return response.data;
  },
  createStudent: async (data) => {
    const response = await apiClient.post('/api/students', data);
    return response.data;
  },
  updateStudent: async (id, data) => {
    const response = await apiClient.put(`/api/students/${id}`, data);
    return response.data;
  },
  deleteStudent: async (id) => {
    const response = await apiClient.delete(`/api/students/${id}`);
    return response.data;
  },
};
