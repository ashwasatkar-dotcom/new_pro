import React, { useState, useEffect } from 'react';
import { complaintService } from '../../services/complaintService';
import { studentService } from '../../services/studentService';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';

const ComplaintsDesk = () => {
  const [complaints, setComplaints] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activePriority, setActivePriority] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');

  // New ticket modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    description: '',
    category: 'Plumbing',
    priority: 'HIGH',
    assignedStaff: 'David Miller (Facilities Lead)',
  });

  // Resolve modal
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    loadComplaints();
    loadStudents();
  }, [activeCategory, activePriority, activeStatus]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const res = await complaintService.getAllComplaints({
        category: activeCategory !== 'ALL' ? activeCategory : null,
        priority: activePriority !== 'ALL' ? activePriority : null,
        status: activeStatus !== 'ALL' ? activeStatus : null,
      });
      if (res.success) {
        setComplaints(res.data);
      }
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await studentService.getAllStudents();
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      await complaintService.createComplaint(formData);
      setIsModalOpen(false);
      setFormData({
        studentId: '',
        title: '',
        description: '',
        category: 'Plumbing',
        priority: 'HIGH',
        assignedStaff: 'David Miller (Facilities Lead)',
      });
      loadComplaints();
    } catch (err) {
      console.error('Failed to create complaint', err);
      alert(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const handleOpenResolve = (ticket) => {
    setSelectedTicket(ticket);
    setResolutionNotes(ticket.resolutionNotes || '');
    setResolveModalOpen(true);
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      await complaintService.updateStatus(selectedTicket.id, {
        status: 'RESOLVED',
        resolutionNotes,
        assignedStaff: selectedTicket.assignedStaff || 'Facilities Lead',
      });
      setResolveModalOpen(false);
      loadComplaints();
    } catch (err) {
      console.error('Failed to resolve complaint', err);
    }
  };

  const handleQuickStatus = async (ticketId, newStatus) => {
    try {
      await complaintService.updateStatus(ticketId, {
        status: newStatus,
      });
      loadComplaints();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="flex flex-col w-full px-gutter-mobile py-4 gap-space-md">
      {/* Top Header */}
      <section className="flex items-center justify-between">
        <div>
          <span className="font-label-md text-label-md text-secondary tracking-wide uppercase">
            Facility Desk
          </span>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            Complaints & Maintenance
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary rounded-xl font-label-md text-sm font-semibold hover:bg-primary-container shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_alert</span>
          <span>New Work Order</span>
        </button>
      </section>

      {/* Filter Chips Bar */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => {
            setActiveCategory('ALL');
            setActivePriority('ALL');
          }}
          className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all ${
            activeCategory === 'ALL' && activePriority === 'ALL'
              ? 'bg-primary text-on-primary font-bold'
              : 'bg-surface-container-lowest text-secondary hover:text-on-surface'
          }`}
        >
          All Complaints
        </button>

        <button
          onClick={() => {
            setActivePriority('HIGH');
            setActiveCategory('ALL');
          }}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all ${
            activePriority === 'HIGH'
              ? 'bg-red-600 text-white font-bold'
              : 'bg-surface-container-lowest text-red-700 hover:bg-red-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>High Priority</span>
        </button>

        {['Plumbing', 'Electrical', 'WiFi', 'Cleanliness', 'Carpentry'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setActivePriority('ALL');
            }}
            className={`shrink-0 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all ${
              activeCategory === cat
                ? 'bg-primary text-on-primary font-bold'
                : 'bg-surface-container-lowest text-secondary hover:text-on-surface'
            }`}
          >
            {cat}
          </button>
        ))}

        <select
          value={activeStatus}
          onChange={(e) => setActiveStatus(e.target.value)}
          className="ml-auto px-3 py-1.5 bg-surface-container-lowest rounded-full border border-slate-200 text-xs font-semibold text-secondary outline-none cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </section>

      {/* Complaints Stream List */}
      <div className="flex flex-col gap-space-sm">
        {loading ? (
          <div className="p-8 text-center text-secondary flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span>Fetching maintenance queue...</span>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-8 bg-surface-container-lowest rounded-xl text-center text-secondary border border-slate-200">
            No complaints found for the selected filter.
          </div>
        ) : (
          complaints.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm p-space-md gap-space-sm relative overflow-hidden border border-slate-200 hover:shadow-md transition-shadow"
            >
              {/* Header stripe accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  ticket.priority === 'HIGH' || ticket.priority === 'URGENT'
                    ? 'bg-red-500'
                    : ticket.priority === 'MEDIUM'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />

              {/* Card Header */}
              <div className="flex items-start justify-between gap-space-xs">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-label-md text-label-md text-primary font-bold tracking-tight">
                      #{ticket.ticketNumber}
                    </span>
                    <Badge status={ticket.priority}>{ticket.priority}</Badge>
                    <Badge status={ticket.status}>{ticket.status}</Badge>
                  </div>
                  <h2 className="font-title-md text-title-md text-on-surface mt-1 font-bold">
                    {ticket.title}
                  </h2>
                </div>
                <span className="shrink-0 text-outline font-label-sm text-xs whitespace-nowrap">
                  {ticket.category}
                </span>
              </div>

              {/* Student & Location Bar */}
              <div className="flex items-center justify-between p-space-xs rounded-xl bg-surface-container-low">
                <div className="flex items-center gap-space-xs min-w-0">
                  <img
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    src={
                      ticket.studentAvatarUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop'
                    }
                    alt={ticket.studentName}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-md text-xs text-on-surface font-semibold truncate">
                      {ticket.studentName}
                    </span>
                    <span className="font-body-sm text-[11px] text-secondary truncate">
                      {ticket.roomNumber || 'Room 204'} • {ticket.wing || 'Wing B'}
                    </span>
                  </div>
                </div>

                {ticket.assignedStaff && (
                  <span className="text-xs text-secondary italic truncate max-w-[180px]">
                    Assigned: {ticket.assignedStaff}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {ticket.description}
              </p>

              {ticket.resolutionNotes && (
                <div className="p-2 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-200">
                  <span className="font-bold">Resolution: </span>
                  {ticket.resolutionNotes}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-surface-container">
                <div className="flex items-center gap-2">
                  {ticket.status !== 'IN_PROGRESS' && ticket.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleQuickStatus(ticket.id, 'IN_PROGRESS')}
                      className="px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold hover:bg-amber-200 transition-colors"
                    >
                      Set In-Progress
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {ticket.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleOpenResolve(ticket)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                      <span>Mark Resolved</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Complaint Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Complaint / Work Order">
        <form onSubmit={handleCreateComplaint} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Resident Student</label>
            <select
              required
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">-- Choose Student --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.rollNumber} - {s.roomNumber || 'No Room'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Bathroom Pipe Leakage"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="WiFi">WiFi</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Discipline">Discipline</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Technician / Staff</label>
            <input
              type="text"
              value={formData.assignedStaff}
              onChange={(e) => setFormData({ ...formData, assignedStaff: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors mt-2"
          >
            Create Work Order
          </button>
        </form>
      </Modal>

      {/* Resolve Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title={`Resolve Complaint #${selectedTicket?.ticketNumber}`}
      >
        <form onSubmit={handleSaveResolution} className="flex flex-col gap-3">
          <p className="text-sm text-secondary font-medium">
            Issue: <span className="text-on-surface font-bold">{selectedTicket?.title}</span>
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Resolution Notes</label>
            <textarea
              required
              rows={3}
              placeholder="Detail actions taken, replaced components, and technician sign-off..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors mt-2"
          >
            Confirm Resolution & Close Ticket
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintsDesk;
