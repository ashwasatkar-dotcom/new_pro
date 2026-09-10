import apiClient from './apiClient';

export const feeService = {
  getAllInvoices: async (params = {}) => {
    const response = await apiClient.get('/api/fees', { params });
    return response.data;
  },
  getInvoiceById: async (id) => {
    const response = await apiClient.get(`/api/fees/${id}`);
    return response.data;
  },
  getStudentInvoices: async (studentId) => {
    const response = await apiClient.get(`/api/fees/student/${studentId}`);
    return response.data;
  },
  createInvoice: async (data) => {
    const response = await apiClient.post('/api/fees', data);
    return response.data;
  },
  recordPayment: async (id, paymentData) => {
    const response = await apiClient.post(`/api/fees/${id}/pay`, paymentData);
    return response.data;
  },
  sendReminder: async (id) => {
    const response = await apiClient.post(`/api/fees/${id}/remind`);
    return response.data;
  },
};
