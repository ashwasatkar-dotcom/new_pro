import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Drawer = ({ isOpen, onClose }) => {
  const { user, logout, isWarden } = useAuth();
  const navigate = useNavigate();
  const [activeRoleView, setActiveRoleView] = useState(isWarden() ? 'warden' : 'student');

  if (!isOpen) return null;

  const handleRoleChange = (role) => {
    setActiveRoleView(role);
    if (role === 'warden') {
      navigate('/warden/dashboard');
    } else {
      navigate('/student/dashboard');
    }
    onClose();
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-space-sm px-space-sm h-11 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary text-on-primary font-semibold shadow-sm'
        : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop scrim */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <aside className="relative w-4/5 max-w-xs bg-surface-container-lowest shadow-[0_20px_25px_-5px_rgba(15,23,42,0.12)] flex flex-col h-full z-10 pt-safe pb-safe animate-in slide-in-from-left duration-200">
        {/* Header with logo & close */}
        <div className="p-space-md flex items-center justify-between border-b border-surface-container">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-sm shadow-sm">
              H
            </div>
            <span className="font-headline-sm text-headline-sm text-primary font-bold">HostelHub</span>
          </div>
          <button
            type="button"
            aria-label="Close drawer"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Role Switcher Pill */}
        <div className="px-space-md py-space-md">
          <div className="bg-surface-container p-space-2xs rounded-full flex relative">
            <button
              type="button"
              onClick={() => handleRoleChange('warden')}
              className={`flex-1 py-1.5 rounded-full font-label-md text-label-md text-center transition-all ${
                activeRoleView === 'warden'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.06)]'
                  : 'text-on-surface-variant'
              }`}
            >
              Warden
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex-1 py-1.5 rounded-full font-label-md text-label-md text-center transition-all ${
                activeRoleView === 'student'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-[0_2px_4px_rgba(0,0,0,0.06)]'
                  : 'text-on-surface-variant'
              }`}
            >
              Student
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-space-md py-space-xs flex flex-col gap-space-2xs">
          {activeRoleView === 'warden' ? (
            <div className="flex flex-col gap-space-2xs">
              <span className="px-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                Warden Operations
              </span>
              <NavLink to="/warden/dashboard" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span className="font-body-md text-body-md">Dashboard</span>
              </NavLink>
              <NavLink to="/warden/students" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">group</span>
                <span className="font-body-md text-body-md">Students</span>
              </NavLink>
              <NavLink to="/warden/rooms" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                <span className="font-body-md text-body-md">Rooms</span>
              </NavLink>
              <NavLink to="/warden/attendance" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                <span className="font-body-md text-body-md">Attendance</span>
              </NavLink>
              <NavLink to="/warden/complaints" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">report_problem</span>
                <span className="font-body-md text-body-md">Complaints</span>
              </NavLink>
              <NavLink to="/warden/fees" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">payments</span>
                <span className="font-body-md text-body-md">Fees</span>
              </NavLink>
            </div>
          ) : (
            <div className="flex flex-col gap-space-2xs">
              <span className="px-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                Student Resident
              </span>
              <NavLink to="/student/dashboard" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
                <span className="font-body-md text-body-md">My Dashboard</span>
              </NavLink>
              <NavLink to="/warden/complaints" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
                <span className="font-body-md text-body-md">Complaints</span>
              </NavLink>
              <NavLink to="/warden/fees" className={navLinkClass} onClick={onClose}>
                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                <span className="font-body-md text-body-md">Fees & Dues</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Footer User Info */}
        <div className="p-space-md bg-surface-container-low flex items-center justify-between border-t border-surface-container">
          <div className="flex items-center gap-space-sm min-w-0">
            <img
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover shrink-0"
              src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDwfQuPj2ZlskBFeOtCqCInOeJdDLeYXRPR29TDK54xCx19QykDHGp2k4LljWsTnQ8EMb7dMBr9IKc6k12_1kWR9vsAJqRFI4UndWy_KAbSkmjLMpHpardYsFh8nSMM25Rdc04F7CQFGApKzxJxLCgKWZ6HZykYpZeSJ9wKKMcOhclTpUGmnMQdf2nrgemJWgEkbEcZRSnkZa3F6QplYhtCMl5ekWurCPHo_iB4qsDYv5UeGzRy6RHiEw"}
            />
            <div className="flex flex-col min-w-0">
              <span className="font-title-md text-title-md text-on-surface truncate font-semibold">
                {user?.fullName || "Staff Member"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                {user?.role === 'ROLE_WARDEN' ? 'Chief Warden • Block B' : 'Resident Student'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="p-2 text-secondary hover:text-error transition-colors"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Drawer;
