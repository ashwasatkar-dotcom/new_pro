import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { isWarden } = useAuth();

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center flex-1 py-1.5 transition-colors ${
      isActive ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
    }`;

  if (!isWarden()) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-surface-container-high z-40 flex items-center justify-around px-2 md:hidden">
        <NavLink to="/student/dashboard" className={navItemClass}>
          <span className="material-symbols-outlined text-[22px]">space_dashboard</span>
          <span className="font-label-sm text-[10px] tracking-tight">Dashboard</span>
        </NavLink>
        <NavLink to="/warden/complaints" className={navItemClass}>
          <span className="material-symbols-outlined text-[22px]">support_agent</span>
          <span className="font-label-sm text-[10px] tracking-tight">Complaints</span>
        </NavLink>
        <NavLink to="/warden/fees" className={navItemClass}>
          <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          <span className="font-label-sm text-[10px] tracking-tight">Fees</span>
        </NavLink>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-surface-container-high z-40 flex items-center justify-around px-1 md:hidden">
      <NavLink to="/warden/dashboard" className={navItemClass}>
        <span className="material-symbols-outlined text-[22px]">dashboard</span>
        <span className="font-label-sm text-[10px] tracking-tight">Overview</span>
      </NavLink>
      <NavLink to="/warden/students" className={navItemClass}>
        <span className="material-symbols-outlined text-[22px]">group</span>
        <span className="font-label-sm text-[10px] tracking-tight">Students</span>
      </NavLink>
      <NavLink to="/warden/rooms" className={navItemClass}>
        <span className="material-symbols-outlined text-[22px]">meeting_room</span>
        <span className="font-label-sm text-[10px] tracking-tight">Rooms</span>
      </NavLink>
      <NavLink to="/warden/attendance" className={navItemClass}>
        <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
        <span className="font-label-sm text-[10px] tracking-tight">Roll Call</span>
      </NavLink>
      <NavLink to="/warden/complaints" className={navItemClass}>
        <span className="material-symbols-outlined text-[22px]">report_problem</span>
        <span className="font-label-sm text-[10px] tracking-tight">Desk</span>
      </NavLink>
      <NavLink to="/warden/fees" className={navItemClass}>
        <span className="material-symbols-outlined text-[22px]">payments</span>
        <span className="font-label-sm text-[10px] tracking-tight">Fees</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
