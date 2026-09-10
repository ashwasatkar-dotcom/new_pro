import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';

const AttendanceRollCall = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWing, setSelectedWing] = useState('Wing B');
  const [selectedFloor, setSelectedFloor] = useState(2);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadAttendance();
  }, [selectedDate, selectedWing, selectedFloor]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAttendanceByDate({
        date: selectedDate,
        wing: selectedWing !== 'ALL' ? selectedWing : null,
        floor: selectedFloor > 0 ? selectedFloor : null,
      });
      if (res.success) {
        setRecords(res.data);
      }
    } catch (err) {
      console.error('Failed to load attendance', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (studentId, status) => {
    try {
      // Optimistic update
      setRecords((prev) =>
        prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
      );

      await attendanceService.markAttendance({
        studentId,
        recordDate: selectedDate,
        status,
        checkInTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      });
    } catch (err) {
      console.error('Failed to mark attendance', err);
      loadAttendance();
    }
  };

  const handleMarkAllPresent = async () => {
    try {
      const items = records.map((r) => ({
        studentId: r.studentId,
        recordDate: selectedDate,
        status: 'PRESENT',
        checkInTime: '21:30',
        remarks: 'Batch roll call confirmed',
      }));

      await attendanceService.markBatch({
        recordDate: selectedDate,
        items,
      });

      loadAttendance();
    } catch (err) {
      console.error('Failed to batch mark attendance', err);
    }
  };

  // Metric counts
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const leaveCount = records.filter((r) => r.status === 'LEAVE').length;
  const total = records.length || 1;

  return (
    <div className="flex flex-col w-full px-gutter-mobile py-4 gap-space-md">
      {/* Top Header & Curfew Alert */}
      <section className="flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-md text-label-md text-secondary tracking-wide uppercase">
              Daily Curfew Roll Call
            </span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
              Attendance Verification
            </h1>
          </div>
          <button
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 bg-emerald-700 text-white rounded-xl font-label-md text-sm font-semibold hover:bg-emerald-800 shadow-sm transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            <span>Mark All Present</span>
          </button>
        </div>

        {/* Curfew Countdown Pill */}
        <div className="bg-surface-container-lowest border border-slate-200 rounded-xl p-space-sm shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">schedule</span>
            <div>
              <span className="font-title-md text-sm font-bold text-on-surface block">
                Night Inspection Log • Date: {selectedDate}
              </span>
              <span className="text-xs text-secondary">
                Curfew: 22:00 hrs • Biometric Gate Sync Enabled
              </span>
            </div>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1.5 bg-surface-container rounded-lg border border-slate-200 text-xs font-semibold outline-none cursor-pointer"
          />
        </div>
      </section>

      {/* Spatial Scope Filter Bar */}
      <section className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm border border-slate-200 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-bold">
            Spatial Scope
          </span>
          <button
            onClick={() => {
              setSelectedWing('ALL');
              setSelectedFloor(0);
            }}
            className="font-label-sm text-label-sm text-primary hover:underline font-semibold"
          >
            Reset to All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Wing Selector */}
          <div className="relative bg-surface-container rounded-lg px-3 py-2 flex flex-col justify-center">
            <span className="font-label-sm text-[10px] text-outline uppercase font-bold">WING</span>
            <select
              value={selectedWing}
              onChange={(e) => setSelectedWing(e.target.value)}
              className="font-title-md text-sm text-on-surface bg-transparent outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="ALL">All Wings</option>
              <option value="Wing A">Wing A</option>
              <option value="Wing B">Wing B</option>
              <option value="Wing C">Wing C</option>
            </select>
          </div>

          {/* Floor Selector */}
          <div className="relative bg-surface-container rounded-lg px-3 py-2 flex flex-col justify-center">
            <span className="font-label-sm text-[10px] text-outline uppercase font-bold">FLOOR</span>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(Number(e.target.value))}
              className="font-title-md text-sm text-on-surface bg-transparent outline-none cursor-pointer appearance-none pr-4"
            >
              <option value={0}>All Floors</option>
              <option value={1}>1st Floor</option>
              <option value={2}>2nd Floor</option>
              <option value={3}>3rd Floor</option>
              <option value={4}>4th Floor</option>
            </select>
          </div>
        </div>
      </section>

      {/* Attendance Metrics Grid */}
      <section className="grid grid-cols-4 gap-space-xs">
        <div className="bg-surface-container-lowest rounded-xl p-space-xs shadow-sm border border-slate-200 flex flex-col items-center text-center">
          <span className="text-[11px] text-secondary font-semibold">Present</span>
          <span className="text-xl font-bold text-emerald-700 font-numeric-table">{presentCount}</span>
          <span className="text-[10px] text-emerald-700 font-bold">
            {Math.round((presentCount / total) * 100)}%
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-xs shadow-sm border border-slate-200 flex flex-col items-center text-center">
          <span className="text-[11px] text-secondary font-semibold">Late</span>
          <span className="text-xl font-bold text-amber-600 font-numeric-table">{lateCount}</span>
          <span className="text-[10px] text-amber-600 font-bold">
            {Math.round((lateCount / total) * 100)}%
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-xs shadow-sm border border-slate-200 flex flex-col items-center text-center">
          <span className="text-[11px] text-secondary font-semibold">Absent</span>
          <span className="text-xl font-bold text-red-600 font-numeric-table">{absentCount}</span>
          <span className="text-[10px] text-red-600 font-bold">
            {Math.round((absentCount / total) * 100)}%
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-space-xs shadow-sm border border-slate-200 flex flex-col items-center text-center">
          <span className="text-[11px] text-secondary font-semibold">On Leave</span>
          <span className="text-xl font-bold text-blue-600 font-numeric-table">{leaveCount}</span>
          <span className="text-[10px] text-blue-600 font-bold">
            {Math.round((leaveCount / total) * 100)}%
          </span>
        </div>
      </section>

      {/* Interactive Roll Call List */}
      <div className="flex flex-col gap-space-xs">
        {loading ? (
          <div className="p-8 text-center text-secondary flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span>Checking gate and room logs...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 bg-surface-container-lowest rounded-xl text-center text-secondary border border-slate-200">
            No residents found for the selected wing/floor.
          </div>
        ) : (
          records.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Resident identity */}
              <div className="flex items-center gap-space-xs min-w-0">
                <img
                  src={
                    item.avatarUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop'
                  }
                  alt={item.studentName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-title-md text-sm font-bold text-on-surface truncate">
                      {item.studentName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-primary-fixed text-on-primary-fixed font-mono text-[11px] font-bold">
                      {item.roomNumber} ({item.bedNumber || 'Bed A'})
                    </span>
                  </div>
                  <span className="text-xs text-secondary">
                    {item.rollNumber} • Check-in: {item.checkInTime || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Status Toggle Buttons */}
              <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.studentId, 'PRESENT')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    item.status === 'PRESENT'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Present
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.studentId, 'LATE')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    item.status === 'LATE'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Late
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.studentId, 'ABSENT')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    item.status === 'ABSENT'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Absent
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.studentId, 'LEAVE')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    item.status === 'LEAVE'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Leave
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceRollCall;
