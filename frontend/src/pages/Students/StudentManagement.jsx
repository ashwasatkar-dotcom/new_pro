import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { roomService } from '../../services/roomService';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'LOW_ATTENDANCE'
  const [selectedWing, setSelectedWing] = useState('ALL');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    rollNumber: '',
    fullName: '',
    email: '',
    phone: '',
    roomId: '',
    bedNumber: 'Bed A',
    department: 'B.Tech CS',
    academicYear: '3rd Yr',
    guardianName: '',
    guardianPhone: '',
    feeStatus: 'PAID',
    status: 'ACTIVE',
  });

  // Dossier details modal
  const [dossierStudent, setDossierStudent] = useState(null);

  useEffect(() => {
    loadStudents();
    loadRooms();
  }, [activeFilter, selectedWing]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      let feeFilter = activeFilter === 'PENDING' ? 'PENDING' : null;
      let wingFilter = selectedWing !== 'ALL' ? selectedWing : null;

      const res = await studentService.getAllStudents({
        query: searchQuery,
        feeStatus: feeFilter,
        wing: wingFilter,
      });
      if (res.success) {
        let list = res.data;
        if (activeFilter === 'LOW_ATTENDANCE') {
          list = list.filter((s) => s.attendanceRate < 75);
        }
        setStudents(list);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const res = await roomService.getAllRooms();
      if (res.success) {
        setRooms(res.data);
      }
    } catch (err) {
      console.error('Failed to load rooms', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadStudents();
  };

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setFormData({
      rollNumber: `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
      fullName: '',
      email: '',
      phone: '',
      roomId: rooms[0]?.id || '',
      bedNumber: 'Bed A',
      department: 'B.Tech Computer Science',
      academicYear: '1st Yr',
      guardianName: '',
      guardianPhone: '',
      feeStatus: 'PAID',
      status: 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, formData);
      } else {
        await studentService.createStudent(formData);
      }
      setIsModalOpen(false);
      loadStudents();
    } catch (err) {
      console.error('Failed to save student', err);
      alert(err.response?.data?.message || 'Failed to save student record');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to remove this student record?')) {
      try {
        await studentService.deleteStudent(id);
        loadStudents();
      } catch (err) {
        console.error('Failed to delete student', err);
      }
    }
  };

  return (
    <div className="flex flex-col w-full px-gutter-mobile py-4 gap-space-md">
      {/* Top Header */}
      <section className="flex items-center justify-between">
        <div>
          <span className="font-label-md text-label-md text-secondary tracking-wide uppercase">
            Directory Registry
          </span>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            Student Management
          </h1>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>Add Student</span>
        </button>
      </section>

      {/* Search & Filter Section */}
      <section className="flex flex-col gap-space-xs">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search student name, roll number, or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest text-on-surface pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary text-body-md outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-secondary-container text-on-secondary-container rounded-xl font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors"
          >
            Search
          </button>
        </form>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap shadow-sm ${
              activeFilter === 'ALL'
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-lowest text-secondary hover:bg-surface-container'
            }`}
          >
            All Active
          </button>

          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap shadow-sm ${
              activeFilter === 'PENDING'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-surface-container-lowest text-amber-800 hover:bg-amber-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Fee Pending</span>
          </button>

          <button
            onClick={() => setActiveFilter('LOW_ATTENDANCE')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap shadow-sm ${
              activeFilter === 'LOW_ATTENDANCE'
                ? 'bg-error text-white font-bold'
                : 'bg-surface-container-lowest text-error hover:bg-error-container/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">trending_down</span>
            <span>Low Attendance (&lt;75%)</span>
          </button>

          <select
            value={selectedWing}
            onChange={(e) => setSelectedWing(e.target.value)}
            className="ml-auto px-3 py-1.5 bg-surface-container-lowest rounded-full border border-slate-200 text-sm font-semibold text-secondary outline-none shadow-sm cursor-pointer"
          >
            <option value="ALL">All Wings</option>
            <option value="Wing A">Wing A</option>
            <option value="Wing B">Wing B</option>
            <option value="Wing C">Wing C</option>
          </select>
        </div>
      </section>

      {/* Roster Counter */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="font-numeric-table text-numeric-table font-semibold text-primary">
            {students.length}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Registered Student Records Displayed
          </span>
        </div>
      </div>

      {/* Student Management Cards List */}
      <div className="flex flex-col gap-space-md">
        {loading ? (
          <div className="p-8 text-center text-secondary flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span>Loading student roster...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 bg-surface-container-lowest rounded-xl text-center text-secondary border border-slate-200">
            No students match the selected criteria.
          </div>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="flex flex-col bg-surface-container-lowest rounded-xl shadow-sm p-space-md gap-space-sm border border-slate-200 transition-all hover:shadow-md"
            >
              {/* Identity & Headshot */}
              <div className="flex items-start gap-space-sm">
                <div className="relative shrink-0">
                  <img
                    className="w-12 h-12 rounded-xl object-cover shadow-sm"
                    src={
                      student.avatarUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop'
                    }
                    alt={student.fullName}
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-xs flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </span>
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="font-title-md text-title-md text-on-surface font-bold truncate">
                      {student.fullName}
                    </h2>
                    <span className="px-2 py-0.5 rounded-md font-numeric-table text-body-sm font-semibold bg-primary-fixed text-on-primary-fixed shrink-0">
                      {student.roomNumber || 'Unassigned'}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    ID: {student.rollNumber} • {student.department} ({student.academicYear})
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-body-sm text-body-sm text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">call</span>
                      {student.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Row */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800">
                    {student.attendanceRate}% Attendance
                  </span>
                  <Badge status={student.feeStatus}>{student.feeStatus}</Badge>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDossierStudent(student)}
                    className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-container transition-colors"
                    title="View Student Dossier"
                  >
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingStudent(student);
                      setFormData({
                        rollNumber: student.rollNumber,
                        fullName: student.fullName,
                        email: student.email,
                        phone: student.phone,
                        roomId: student.roomId || '',
                        bedNumber: student.bedNumber || 'Bed A',
                        department: student.department,
                        academicYear: student.academicYear,
                        guardianName: student.guardianName || '',
                        guardianPhone: student.guardianPhone || '',
                        feeStatus: student.feeStatus,
                        status: student.status,
                      });
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-container transition-colors"
                    title="Edit Record"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error-container/30 transition-colors"
                    title="Delete Student"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? 'Edit Student Record' : 'Register New Student'}
      >
        <form onSubmit={handleSaveStudent} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
              <input
                type="text"
                required
                disabled={!!editingStudent}
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Room Assignment</label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="">Unassigned</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} ({r.wing} - {r.occupiedBeds}/{r.capacity})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bed Slot</label>
              <select
                value={formData.bedNumber}
                onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Bed A">Bed A</option>
                <option value="Bed B">Bed B</option>
                <option value="Bed C">Bed C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Status</label>
              <select
                value={formData.feeStatus}
                onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_LEAVE">ON LEAVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-3 w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors"
          >
            {editingStudent ? 'Update Student Record' : 'Create Student'}
          </button>
        </form>
      </Modal>

      {/* Student Dossier Modal */}
      {dossierStudent && (
        <Modal
          isOpen={!!dossierStudent}
          onClose={() => setDossierStudent(null)}
          title={`Student Dossier: ${dossierStudent.fullName}`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
              <img
                src={
                  dossierStudent.avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop'
                }
                alt={dossierStudent.fullName}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-on-surface text-base">{dossierStudent.fullName}</h4>
                <p className="text-xs text-secondary">
                  {dossierStudent.rollNumber} • {dossierStudent.department}
                </p>
                <div className="flex gap-2 mt-1">
                  <Badge status={dossierStudent.status}>{dossierStudent.status}</Badge>
                  <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-xs font-bold">
                    {dossierStudent.roomNumber || 'No Room'} ({dossierStudent.bedNumber || 'No Bed'})
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2.5 bg-surface-container-low rounded-lg">
                <span className="text-xs text-secondary block">Contact Email</span>
                <span className="font-medium text-on-surface">{dossierStudent.email}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg">
                <span className="text-xs text-secondary block">Phone Number</span>
                <span className="font-medium text-on-surface">{dossierStudent.phone}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg">
                <span className="text-xs text-secondary block">Guardian Name</span>
                <span className="font-medium text-on-surface">{dossierStudent.guardianName || 'N/A'}</span>
              </div>
              <div className="p-2.5 bg-surface-container-low rounded-lg">
                <span className="text-xs text-secondary block">Guardian Phone</span>
                <span className="font-medium text-on-surface">{dossierStudent.guardianPhone || 'N/A'}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentManagement;
