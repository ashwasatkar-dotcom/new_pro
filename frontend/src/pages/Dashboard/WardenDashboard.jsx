import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import StatTile from '../../components/common/StatTile';
import { formatCurrency } from '../../utils/formatters';

const WardenDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const res = await dashboardService.getWardenStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load warden dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col w-full px-gutter-mobile py-4 gap-space-md">
      {/* Top Greeting & Context Section */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md text-secondary tracking-wide uppercase">
            Institutional Warden Console
          </span>
          <span className="font-numeric-table text-numeric-table text-secondary font-medium">
            Today • {currentDate}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
            Welcome back, <span className="text-primary">Dr. Eleanor Vance</span>
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Chief Warden • Block Alpha & Bravo Quadrants
          </p>
        </div>

        {/* Live Campus Alert Pill */}
        <div className="mt-space-2xs bg-primary-container text-on-primary rounded-xl px-space-md py-space-xs flex items-center gap-space-xs shadow-md">
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-on-primary-container opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-on-primary"></span>
          </div>
          <span className="font-label-md text-label-md tracking-tight flex-1">
            Campus Curfew: <span className="font-bold">10:00 PM</span> • All Gates Monitored
          </span>
          <span className="material-symbols-outlined text-[18px] text-on-primary-container">shield</span>
        </div>
      </section>

      {/* Quick Administrative Actions Bar */}
      <section className="flex flex-col gap-space-2xs">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
            Quick Administrative Actions
          </span>
        </div>
        <div className="flex gap-space-xs overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => navigate('/warden/attendance')}
            className="flex items-center gap-space-xs bg-primary text-on-primary px-space-md py-2.5 rounded-xl shadow-sm whitespace-nowrap active:scale-95 transition-transform flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">fact_check</span>
            <span className="font-label-md text-label-md">Take Attendance</span>
          </button>

          <button
            onClick={() => navigate('/warden/rooms')}
            className="flex items-center gap-space-xs bg-surface-container-highest text-on-surface px-space-md py-2.5 rounded-xl shadow-sm whitespace-nowrap active:scale-95 transition-transform flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">add_business</span>
            <span className="font-label-md text-label-md">Assign Room</span>
          </button>

          <button
            onClick={() => navigate('/warden/complaints')}
            className="flex items-center gap-space-xs bg-surface-container-highest text-on-surface px-space-md py-2.5 rounded-xl shadow-sm whitespace-nowrap active:scale-95 transition-transform flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-error">assignment_late</span>
            <span className="font-label-md text-label-md">Resolve Complaints</span>
          </button>

          <button
            onClick={() => navigate('/warden/fees')}
            className="flex items-center gap-space-xs bg-surface-container-highest text-on-surface px-space-md py-2.5 rounded-xl shadow-sm whitespace-nowrap active:scale-95 transition-transform flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            <span className="font-label-md text-label-md">Export Fee Report</span>
          </button>

          <button
            onClick={() => navigate('/warden/students')}
            className="flex items-center gap-space-xs bg-surface-container-highest text-on-surface px-space-md py-2.5 rounded-xl shadow-sm whitespace-nowrap active:scale-95 transition-transform flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
            <span className="font-label-md text-label-md">Students Directory</span>
          </button>
        </div>
      </section>

      {/* Facility Telemetry Grid (2x4 Visual Tiles) */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
            <span className="font-title-md text-title-md text-on-surface font-bold">Facility Telemetry</span>
          </div>
          <span className="bg-surface-container text-on-surface-variant font-label-sm text-[11px] px-2 py-0.5 rounded-full">
            Real-time sync
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-xs">
          <StatTile
            icon="groups"
            title="Active Residents"
            value={stats ? stats.totalStudents : 420}
            badgeText="Active"
            badgeColor="bg-surface-container-highest text-secondary"
          />

          <StatTile
            icon="domain"
            title="Total Capacity"
            value={stats ? stats.totalRooms : 120}
            badgeText="4 Wings"
            badgeColor="bg-surface-container text-on-surface-variant"
          />

          <StatTile
            icon="bed"
            title="Occupied Rooms"
            value={stats ? stats.occupiedRooms : 108}
            badgeText="90% Cap"
            badgeColor="bg-secondary-container text-on-secondary-container"
            iconBg="bg-secondary-container text-on-secondary-container"
          />

          <StatTile
            icon="door_open"
            title="Available Ready"
            value={stats ? stats.availableRooms : 12}
            badgeText="Vacant"
            badgeColor="bg-emerald-100 text-emerald-800"
          />

          <StatTile
            icon="savings"
            title="Paid Fees"
            value={stats ? formatCurrency(stats.paidFees) : '$384.5k'}
            badgeText="91.5%"
            badgeColor="bg-surface-container-low text-primary"
          />

          <StatTile
            icon="pending_actions"
            title="Pending Default"
            value={stats ? formatCurrency(stats.pendingFees) : '$35.5k'}
            badgeText={`${stats?.pendingFeesCount || 35} Unpaid`}
            badgeColor="bg-error-container text-on-error-container"
            iconBg="bg-surface-container-high text-error"
          />

          <StatTile
            icon="how_to_reg"
            title="Present Today"
            value={stats ? `${stats.presentToday || 398}` : '398'}
            badgeText={`${stats?.attendanceRateToday || 94.8}%`}
            badgeColor="bg-emerald-100 text-emerald-800"
          />

          <StatTile
            icon="report_problem"
            title="Open Complaints"
            value={stats ? stats.openComplaintsCount : 8}
            badgeText="Action Req."
            badgeColor="bg-amber-100 text-amber-800"
            iconBg="bg-surface-container-high text-amber-600"
          />
        </div>
      </section>

      {/* Operational Highlights Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Curfew Status Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-title-md text-title-md font-bold text-on-surface">Curfew Telemetry</h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-label-sm font-bold">
              GATE LOCK: 22:00
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-secondary mb-4">
            Automated biometric scanners at Wing A, B, and C gates are synchronized with roll call logs. 
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/warden/attendance')}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors"
            >
              Verify Active Absentees
            </button>
          </div>
        </div>

        {/* Priority Complaints Watch */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-title-md text-title-md font-bold text-on-surface">Urgent Maintenance</h3>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-label-sm font-bold">
              3 High Priority
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-secondary mb-4">
            Plumbing vibration on Room 204 and electrical regulator in Room 101 require immediate technician clearance.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/warden/complaints')}
              className="px-4 py-2 bg-surface-container-highest text-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors"
            >
              Inspect Complaints Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;
