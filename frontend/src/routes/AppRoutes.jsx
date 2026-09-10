import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import WardenDashboard from '../pages/Dashboard/WardenDashboard';
import StudentDashboard from '../pages/Dashboard/StudentDashboard';
import StudentManagement from '../pages/Students/StudentManagement';
import RoomAllocation from '../pages/Rooms/RoomAllocation';
import AttendanceRollCall from '../pages/Attendance/AttendanceRollCall';
import ComplaintsDesk from '../pages/Complaints/ComplaintsDesk';
import FeeCollections from '../pages/Fees/FeeCollections';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Layout Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* Default redirect to warden dashboard */}
          <Route path="/" element={<Navigate to="/warden/dashboard" replace />} />

          {/* Warden Routes */}
          <Route path="/warden/dashboard" element={<WardenDashboard />} />
          <Route path="/warden/students" element={<StudentManagement />} />
          <Route path="/warden/rooms" element={<RoomAllocation />} />
          <Route path="/warden/attendance" element={<AttendanceRollCall />} />
          <Route path="/warden/complaints" element={<ComplaintsDesk />} />
          <Route path="/warden/fees" element={<FeeCollections />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
