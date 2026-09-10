import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // New ticket modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Plumbing');
  const [ticketPriority, setTicketPriority] = useState('MEDIUM');
  const [ticketDesc, setTicketDesc] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const res = await dashboardService.getStudentStats();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      const res = await complaintService.createComplaint({
        title: ticketTitle,
        category: ticketCategory,
        priority: ticketPriority,
        description: ticketDesc,
      });
      if (res.success) {
        setSubmitSuccess('Maintenance request submitted successfully!');
        setTicketTitle('');
        setTicketDesc('');
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess('');
          loadStudentData();
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to submit ticket', err);
    }
  };

  return (
    <div className="flex flex-col w-full px-gutter-mobile py-4 gap-space-md">
      {/* Top Student Header */}
      <section className="flex flex-col gap-1">
        <span className="font-label-md text-label-md text-secondary tracking-wide uppercase">
          Resident Portal
        </span>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
          Welcome back, <span className="text-primary">{user?.fullName || 'Aarav Sharma'}</span>
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Room 204 • Bed A • Wing B (3rd Year Computer Science)
        </p>
      </section>

      {/* 2x2 Personal Metrics Bento Grid */}
      <section className="grid grid-cols-2 gap-space-xs">
        {/* Card 1: My Room */}
        <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">bedroom_parent</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-label-sm font-label-sm font-bold">
              1 Spot Free
            </span>
          </div>
          <div className="mt-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block">
              My Room
            </span>
            <span className="text-headline-sm font-headline-sm text-primary font-bold">Room 204</span>
            <p className="text-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
              3/4 Occupied <span className="text-outline text-label-sm">• Wing B</span>
            </p>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-2.5 overflow-hidden flex">
            <div className="bg-primary h-full w-3/4 rounded-full"></div>
          </div>
        </div>

        {/* Card 2: Attendance */}
        <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-label-sm font-bold">
              EXCELLENT
            </span>
          </div>
          <div className="mt-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block">
              Roll Call
            </span>
            <span className="text-headline-sm font-headline-sm text-emerald-900 font-numeric-table font-bold">
              96.2%
            </span>
            <p className="text-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
              38 of 41 days verified
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-label-sm text-emerald-800 font-bold">
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
            <span>14-day curfew streak</span>
          </div>
        </div>

        {/* Card 3: Fee Status */}
        <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-label-sm font-bold">
              CLEARED
            </span>
          </div>
          <div className="mt-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block">
              Term Dues
            </span>
            <span className="text-headline-sm font-headline-sm text-on-surface font-bold">$0.00 Due</span>
            <p className="text-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
              Fall 2024 invoice settled
            </p>
          </div>
        </div>

        {/* Card 4: Open Maintenance */}
        <div className="bg-surface-container-lowest rounded-xl p-space-sm shadow-sm flex flex-col justify-between border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">build</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-label-sm font-bold">
              1 IN PROGRESS
            </span>
          </div>
          <div className="mt-2">
            <span className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider block">
              Work Orders
            </span>
            <span className="text-headline-sm font-headline-sm text-on-surface font-bold">#CMP-1082</span>
            <p className="text-body-sm text-body-sm text-on-surface-variant mt-1 leading-snug">
              Bathroom pipe leakage
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions Buttons */}
      <section className="flex flex-col gap-2">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
          Resident Operations
        </span>
        <div className="grid grid-cols-2 gap-space-xs">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 p-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_task</span>
            <span>Raise Ticket</span>
          </button>

          <button
            onClick={() => navigate('/warden/complaints')}
            className="flex items-center gap-2 p-3 bg-surface-container-lowest text-on-surface border border-slate-200 rounded-xl font-label-md text-label-md font-semibold hover:bg-surface-container shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">history</span>
            <span>My Tickets</span>
          </button>
        </div>
      </section>

      {/* Roommates Roster Section */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-slate-200 flex flex-col gap-space-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-title-md text-title-md font-bold text-on-surface">Room 204 Residents</h3>
          <span className="font-label-sm text-label-sm text-secondary">3 Residents</span>
        </div>

        <div className="flex flex-col divide-y divide-surface-container">
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuy0qw-a0fz4Lnt1ykfAmA0PESEuJsfJvjf9ieSQgb59EaFW4iFX5vDpNbrimJCNiirvjU8mGBfSyyn0XAv0WUoi7rUbyreBRbOsn1uDWFrWnlTZUyeobYMeVKn3IdawuA0VCjcnIRwDmYx3RDerJ9fUu-fnE63tQf3SGXfOxiEN2wLqglWADJMMoG-8Vk-y3WpAiiFi8zA8QWi5k8LAfZqyNTgqMz5qIX50-sYfPsSHkVrJ7L7vhnMQ"
                alt="Aarav"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface block">Aarav Sharma (You)</span>
                <span className="font-body-sm text-[11px] text-secondary">Bed A • STU-2024-089</span>
              </div>
            </div>
            <Badge status="ACTIVE">Bed A</Badge>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop"
                alt="Marcus"
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <span className="font-label-md text-label-md font-bold text-on-surface block">Marcus Chen</span>
                <span className="font-body-sm text-[11px] text-secondary">Bed B • STU-2024-112</span>
              </div>
            </div>
            <Badge status="ACTIVE">Bed B</Badge>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">person_outline</span>
              </div>
              <div>
                <span className="font-label-md text-label-md font-bold text-slate-500 block">Bed C Vacant</span>
                <span className="font-body-sm text-[11px] text-secondary">Available for Allocation</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-label-sm font-bold">
              Vacant
            </span>
          </div>
        </div>
      </section>

      {/* Submit Ticket Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Raise Maintenance Ticket">
        <form onSubmit={handleCreateComplaint} className="flex flex-col gap-4">
          {submitSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-sm font-medium">
              {submitSuccess}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. WiFi router disconnected"
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm bg-white"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="WiFi">WiFi / Network</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Cleanliness">Cleanliness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={ticketPriority}
                onChange={(e) => setTicketPriority(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              placeholder="Describe the issue in detail so facility technicians can bring proper tools..."
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-primary text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors"
          >
            Submit Work Order
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
