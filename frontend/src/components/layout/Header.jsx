import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onOpenDrawer }) => {
  const { user, logout, isWarden } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high">
      <div className="h-16 px-gutter-mobile flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            aria-label="Open menu drawer"
            onClick={onOpenDrawer}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <Link to={isWarden() ? "/warden/dashboard" : "/student/dashboard"} className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-sm shadow-sm">
              H
            </div>
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold">HostelHub</span>
          </Link>
        </div>

        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            className="relative w-11 h-11 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-error ring-2 ring-surface"></span>
          </button>
          
          <div className="flex items-center gap-2">
            <img
              alt={user?.fullName || "User Profile"}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/20"
              src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDwfQuPj2ZlskBFeOtCqCInOeJdDLeYXRPR29TDK54xCx19QykDHGp2k4LljWsTnQ8EMb7dMBr9IKc6k12_1kWR9vsAJqRFI4UndWy_KAbSkmjLMpHpardYsFh8nSMM25Rdc04F7CQFGApKzxJxLCgKWZ6HZykYpZeSJ9wKKMcOhclTpUGmnMQdf2nrgemJWgEkbEcZRSnkZa3F6QplYhtCMl5ekWurCPHo_iB4qsDYv5UeGzRy6RHiEw"}
            />
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error-container/30 transition-colors"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
