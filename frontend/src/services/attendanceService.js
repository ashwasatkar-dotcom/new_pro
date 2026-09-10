import apiClient from './apiClient';

export const attendanceService = {
  getAttendanceByDate: async (params = {}) => {
    const response = await apiClient.get('/api/attendance', { params });
    return response.data;
  },
  getStudentAttendance: async (studentId) => {
    const response = await apiClient.get(`/api/attendance/student/${studentId}`);
    return response.data;
  },
  markAttendance: async (data) => {
    const response = await apiClient.post('/api/attendance', data);
    return response.data;
  },
  markBatch: async (batchData) => {
    const response = await apiClient.post('/api/attendance/batch', batchData);
    return response.data;
  },
};
