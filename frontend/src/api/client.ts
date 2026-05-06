import axios from 'axios';
import type { Course, Instructor, Statistics, LandingPage } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('valcollect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('valcollect_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ===== AUTH =====
export const login = (username: string, password: string) =>
  client.post('/auth/login', { username, password });
export const getMe = () => client.get('/admin/me');

// ===== PUBLIC =====
export const getCourses = () => client.get<Course[]>('/courses');
export const getCourse = (id: string) => client.get<Course>(`/courses/${id}`);
export const getInstructors = () => client.get<Instructor[]>('/instructors');
export const getStats = () => client.get<Statistics>('/stats');
export const enroll = (data: any) => client.post('/enroll', data);
export const submitContact = (data: any) => client.post('/contact', data);
export const submitLead = (data: any) => client.post('/leads', data);
export const getLandingPageBySlug = (slug: string) => client.get<LandingPage>(`/landing-pages/${slug}`);

// ===== ADMIN — LEADS =====
export const getLeads = (params?: any) => client.get('/admin/leads', { params });
export const updateLeadStatus = (id: number, status: string) =>
  client.patch(`/admin/leads/${id}`, { status });
export const deleteLead = (id: number) => client.delete(`/admin/leads/${id}`);
export const bulkDeleteLeads = (ids: number[]) =>
  client.post('/admin/leads/bulk-delete', { ids });
export const exportLeadsExcel = (params?: any) =>
  client.get('/admin/leads/export', { params, responseType: 'blob' });
export const importLeadsExcel = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return client.post('/admin/leads/import', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ===== ADMIN — ENROLLMENTS =====
export const getEnrollments = (params?: any) => client.get('/admin/enrollments', { params });
export const updateEnrollmentStatus = (id: number, status: string) =>
  client.patch(`/admin/enrollments/${id}`, { payment_status: status });
export const deleteEnrollment = (id: number) => client.delete(`/admin/enrollments/${id}`);
export const exportEnrollmentsExcel = () =>
  client.get('/admin/enrollments/export', { responseType: 'blob' });

// ===== ADMIN — COURSES CRUD =====
export const adminCreateCourse = (data: any) => client.post('/admin/courses', data);
export const adminUpdateCourse = (id: number, data: any) => client.put(`/admin/courses/${id}`, data);
export const adminDeleteCourse = (id: number) => client.delete(`/admin/courses/${id}`);

// ===== ADMIN — LANDING PAGES =====
export const getLandingPages = () => client.get('/admin/landing-pages');
export const createLandingPage = (data: any) => client.post('/admin/landing-pages', data);
export const updateLandingPage = (id: number, data: any) => client.put(`/admin/landing-pages/${id}`, data);
export const deleteLandingPage = (id: number) => client.delete(`/admin/landing-pages/${id}`);
export const uploadLandingPageImage = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return client.post('/admin/landing-pages/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ===== ADMIN — MESSAGES =====
export const getMessages = (params?: any) => client.get('/admin/messages', { params });
export const updateMessageStatus = (id: number, status: string, notes?: string) =>
  client.patch(`/admin/messages/${id}`, { status, notes });
export const deleteMessage = (id: number) => client.delete(`/admin/messages/${id}`);

// ===== ADMIN — ANALYTICS =====
export const getAnalytics = () => client.get('/admin/analytics');

export default client;
