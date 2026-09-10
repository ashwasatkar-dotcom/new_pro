import apiClient from './apiClient';

export const roomService = {
  getAllRooms: async (params = {}) => {
    const response = await apiClient.get('/api/rooms', { params });
    return response.data;
  },
  getRoomById: async (id) => {
    const response = await apiClient.get(`/api/rooms/${id}`);
    return response.data;
  },
  createRoom: async (data) => {
    const response = await apiClient.post('/api/rooms', data);
    return response.data;
  },
  updateRoom: async (id, data) => {
    const response = await apiClient.put(`/api/rooms/${id}`, data);
    return response.data;
  },
  assignStudent: async (roomId, studentId, bedNumber) => {
    const response = await apiClient.post(
      `/api/rooms/${roomId}/assign/${studentId}`,
      null,
      { params: { bedNumber } }
    );
    return response.data;
  },
  removeStudent: async (roomId, studentId) => {
    const response = await apiClient.delete(`/api/rooms/${roomId}/remove/${studentId}`);
    return response.data;
  },
};
