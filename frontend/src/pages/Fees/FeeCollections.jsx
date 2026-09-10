import React, { useState, useEffect } from 'react';
import { feeService } from '../../services/feeService';
import { studentService } from '../../services/studentService';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FeeCollections = () => {
  const [invoices, setInvoices] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'all' | 'pending' | 'paid'
  const [searchQuery, setSearchQuery] = useState('');

  // Collect Payment Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [txnRef, setTxnRef] = useState('');

  // New Invoice Modal
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    feeType: 'Hostel Term Fee',
    termName: 'Fall 2024',
    amount: 1450,
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
  });

  const [reminderToast, setReminderToast] = useState('');

  useEffect(() => {
    loadInvoices();
    loadStudents();
  }, [activeTab]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      let statusParam = null;
      if (activeTab === 'pending') statusParam = 'PENDING';
      if (activeTab === 'paid') statusParam = 'PAID';

      const res = await feeService.getAllInvoices({
        status: statusParam,
        query: searchQuery,
      });
      if (res.success) {
        setInvoices(res.data);
      }
    } catch (err) {
      console.error('Failed to load fee invoices', err);
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

  const handleSearch = (e) => {
    e.preventDefault();
    loadInvoices();
  };

  const handleOpenPay = (inv) => {
    setSelectedInvoice(inv);
    setTxnRef(`TXN-${Math.floor(1000000 + Math.random() * 9000000)}`);
    setPayModalOpen(true);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      await feeService.recordPayment(selectedInvoice.id, {
        paymentMode,
        transactionRef: txnRef,
        notes: `Manual settlement recorded by Warden`,
      });
      setPayModalOpen(false);
      loadInvoices();
    } catch (err) {
      console.error('Failed to record payment', err);
      alert(err.response?.data?.message || 'Payment settlement failed');
    }
  };

  const handleSendReminder = async (invoiceId, studentName) => {
    try {
      await feeService.sendReminder(invoiceId);
      setReminderToast(`Formal payment reminder dispatched to ${studentName} & guardian.`);
      setTimeout(() => setReminderToast(''), 3500);
      loadInvoices();
    } catch (err) {
      console.error('Failed to send reminder', err);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      await feeService.createInvoice(invoiceForm);
      setInvoiceModalOpen(false);
      loadInvoices();
    } catch (err) {
      console.error('Failed to create invoice', err);
      alert(err.response?.data?.message || 'Failed to create fee invoice');
    }
  };

  // Compute ledger statistics
  const totalCollected = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalPending = invoices
    .filter((i) => i.status === 'PENDING' || i.status === 'OVERDUE')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="flex flex-col w-full px-gutter-mobile py-4 gap-space-md">
      {/* Toast feedback */}
      {reminderToast && (
        <div className="p-3 bg-primary text-on-primary rounded-xl font-label-md text-sm shadow-md flex items-center justify-between animate-in fade-in">
          <span>{reminderToast}</span>
          <button onClick={() => setReminderToast('')} className="text-white hover:opacity-80">
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <section className="flex items-center justify-between">
        <div>
          <span className="font-label-md text-label-md text-secondary tracking-wide uppercase">
            Accounts & Bursar
          </span>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold">
            Fee Collections & Dues
          </h1>
        </div>
        <button
          onClick={() => setInvoiceModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary rounded-xl font-label-md text-sm font-semibold hover:bg-primary-container shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Issue Invoice</span>
        </button>
      </section>

      {/* Key Ledger Split Indicators (Stitch Navy gradient banner) */}
      <section className="bg-primary text-on-primary rounded-2xl p-space-md shadow-md border border-primary-container flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">
            Semester Vault Ledger
          </span>
          <span className="font-numeric-table text-xs text-primary-fixed">Fall 2024 Cycle</span>
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="bg-surface-container-lowest/15 backdrop-blur-md rounded-xl p-3 flex flex-col">
            <div className="flex items-center gap-1.5 text-primary-fixed">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-label-sm text-xs">Collected In Vault</span>
            </div>
            <span className="font-headline-md text-headline-md text-white font-bold mt-1">
              $384,500
            </span>
            <span className="font-label-sm text-[11px] text-primary-fixed mt-0.5">
              385 residents cleared
            </span>
          </div>

          <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-3 flex flex-col border border-red-400/30">
            <div className="flex items-center gap-1.5 text-red-200">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span className="font-label-sm text-xs">Pending Default</span>
            </div>
            <span className="font-headline-md text-headline-md text-white font-bold mt-1">
              $35,500
            </span>
            <span className="font-label-sm text-[11px] text-red-200 mt-0.5">
              35 residents action req.
            </span>
          </div>
        </div>
      </section>

      {/* Search & Segmented Control Tab Switcher */}
      <section className="flex flex-col gap-space-xs">
        <form onSubmit={handleSearch} className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-outline">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            className="w-full h-11 bg-surface-container-lowest text-on-surface font-body-md text-sm pl-10 pr-4 rounded-xl border border-slate-200 shadow-sm focus:border-primary outline-none"
            placeholder="Search student name, ID, invoice # or txn ref..."
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="bg-surface-container p-1 rounded-xl flex shadow-sm">
          <button
            onClick={() => setActiveTab('all')}
            className={`filter-tab flex-1 py-2 rounded-lg font-label-md text-sm text-center transition-all ${
              activeTab === 'all'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-on-surface-variant'
            }`}
          >
            All Ledger
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`filter-tab flex-1 py-2 rounded-lg font-label-md text-sm text-center transition-all ${
              activeTab === 'pending'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-on-surface-variant'
            }`}
          >
            Pending / Overdue
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`filter-tab flex-1 py-2 rounded-lg font-label-md text-sm text-center transition-all ${
              activeTab === 'paid'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                : 'text-on-surface-variant'
            }`}
          >
            Paid & Settled
          </button>
        </div>
      </section>

      {/* Ledger Invoices Area */}
      <div className="flex flex-col gap-space-sm">
        {loading ? (
          <div className="p-8 text-center text-secondary flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
            <span>Verifying fee records...</span>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8 bg-surface-container-lowest rounded-xl text-center text-secondary border border-slate-200">
            No fee invoices found in this view.
          </div>
        ) : (
          invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-slate-200 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              {/* Top row: student + amount */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-xs min-w-0">
                  <img
                    src={
                      inv.studentAvatarUrl ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop'
                    }
                    alt={inv.studentName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-md text-sm font-bold text-on-surface truncate">
                      {inv.studentName}
                    </span>
                    <span className="font-body-sm text-xs text-secondary truncate">
                      {inv.roomNumber || 'Room 204'} • ID: {inv.studentRollNumber}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-headline-sm text-base font-bold text-on-surface block font-numeric-table">
                    {formatCurrency(inv.amount)}
                  </span>
                  <Badge status={inv.status}>{inv.status}</Badge>
                </div>
              </div>

              {/* Invoice details */}
              <div className="flex items-center justify-between text-xs text-secondary bg-surface-container-low p-2 rounded-lg">
                <span>
                  <strong className="text-on-surface">{inv.invoiceNumber}</strong> • {inv.feeType}
                </span>
                <span>
                  {inv.status === 'PAID'
                    ? `Paid: ${formatDate(inv.paidDate)} via ${inv.paymentMode || 'UPI'}`
                    : `Due: ${formatDate(inv.dueDate)}`}
                </span>
              </div>

              {inv.transactionRef && (
                <div className="text-[11px] font-mono text-secondary">
                  Txn Ref: {inv.transactionRef}
                </div>
              )}

              {/* Action buttons */}
              {inv.status !== 'PAID' && (
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-surface-container">
                  <button
                    onClick={() => handleSendReminder(inv.id, inv.studentName)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-container transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">send_to_mobile</span>
                    <span>Send Notice</span>
                  </button>

                  <button
                    onClick={() => handleOpenPay(inv)}
                    className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                    <span>Collect / Mark Paid</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Record Payment Modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title={`Record Settlement • ${selectedInvoice?.invoiceNumber}`}
      >
        <form onSubmit={handleConfirmPayment} className="flex flex-col gap-3">
          <div className="p-3 bg-surface-container-low rounded-xl text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Resident:</span>
              <span className="font-bold text-on-surface">{selectedInvoice?.studentName}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-secondary">Amount:</span>
              <span className="font-bold text-primary font-numeric-table">
                {formatCurrency(selectedInvoice?.amount)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="UPI">UPI / QR Code</option>
              <option value="Bank Transfer">Direct Bank Wire</option>
              <option value="Credit Card">Campus POS Card</option>
              <option value="Cash">Cash Vault Receipt</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Reference</label>
            <input
              type="text"
              required
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors mt-2"
          >
            Confirm Receipt & Clear Dues
          </button>
        </form>
      </Modal>

      {/* New Invoice Modal */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Issue New Fee Invoice"
      >
        <form onSubmit={handleCreateInvoice} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Resident Student</label>
            <select
              required
              value={invoiceForm.studentId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="">-- Choose Resident --</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.rollNumber} - {s.roomNumber || 'No Room'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fee Type</label>
              <select
                value={invoiceForm.feeType}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, feeType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              >
                <option value="Hostel Term Fee">Hostel Term Fee</option>
                <option value="Mess & Dining Fee">Mess & Dining Fee</option>
                <option value="Security Deposit">Security Deposit</option>
                <option value="Utility Charges">Utility Charges</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Term</label>
              <input
                type="text"
                value={invoiceForm.termName}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, termName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amount ($)</label>
              <input
                type="number"
                min={1}
                required
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={invoiceForm.dueDate}
                onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors mt-2"
          >
            Issue Fee Invoice
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default FeeCollections;
