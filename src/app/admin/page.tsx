'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  ReceiptText,
  TrendingUp,
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  UserCheck,
  Star,
  Video,
  Megaphone,
  ShieldAlert,
  LifeBuoy,
  Bell,
  History,
  Settings,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Send,
  Sliders,
  DollarSign,
  Download,
  Filter,
  Check,
  X,
  LogOut,
  ChevronDown,
  Info,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

type TabType =
  | 'dashboard'
  | 'payments'
  | 'transactions'
  | 'revenue'
  | 'students'
  | 'colleges'
  | 'academic'
  | 'marketplace'
  | 'sellers'
  | 'reviews'
  | 'study_groups'
  | 'announcements'
  | 'reports'
  | 'support'
  | 'notifications'
  | 'audit_logs'
  | 'settings';

export default function AdminPortalPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Global Search State
  const [globalSearch, setGlobalSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Modals & Active Review States
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('Invalid UTR');

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [listingRejectReason, setListingRejectReason] = useState('Does not meet academic guidelines');
  const [showListingRejectModal, setShowListingRejectModal] = useState(false);

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportActionTaken, setReportActionTaken] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [ticketNewStatus, setTicketNewStatus] = useState<string>('resolved');

  // Creation Modals
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [newCollege, setNewCollege] = useState({ name: '', shortName: '', city: 'Chennai', address: '', emailDomains: '' });

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ collegeId: 'dgvaishnav', name: '', code: '', durationYears: 3, totalSemesters: 6 });

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ collegeId: 'dgvaishnav', courseId: 'dgvc_bcom_gen', name: '', code: '', year: 1, semester: 1 });

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    category: 'EVENT',
    collegeId: 'dgvaishnav',
    collegeName: 'DG Vaishnav College',
    organizer: 'Admin Council',
    venueOrOnline: 'Campus Main Auditorium',
    date: new Date().toISOString().split('T')[0],
  });

  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastData, setBroadcastData] = useState({
    type: 'global',
    targetId: '',
    title: '',
    message: '',
  });

  const [settingsForm, setSettingsForm] = useState<any>(null);

  // Filters
  const [txnSearch, setTxnSearch] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [notesSearch, setNotesSearch] = useState('');
  const [notesStatusFilter, setNotesStatusFilter] = useState('all');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/data');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (!settingsForm) {
          setSettingsForm(json.platformSettings);
        }
      }
    } catch {
      showToast('Failed to load administrative dataset', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (action: string, targetId?: string, payload?: any) => {
    try {
      const res = await fetch('/api/admin/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, targetId, payload }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast(json.message || 'Action executed successfully.');
        fetchAdminData();
        return true;
      } else {
        showToast(json.error || 'Action failed.', 'error');
        return false;
      }
    } catch {
      showToast('Server error executing administrative action.', 'error');
      return false;
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E131F] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
          Loading Master Admin Architecture...
        </p>
      </div>
    );
  }

  if (!data) return null;

  const { metrics, actionRequired } = data;

  // Global Search Filtering
  const q = globalSearch.toLowerCase().trim();
  const searchResults = q
    ? {
        students: data.students.filter((s: any) => s.fullName.toLowerCase().includes(q) || s.mobile.includes(q) || s.email?.toLowerCase().includes(q)),
        payments: data.payments.filter((p: any) => p.utrId.toLowerCase().includes(q) || p.buyerName.toLowerCase().includes(q) || p.listingTitle.toLowerCase().includes(q)),
        notes: data.marketplace.filter((n: any) => n.title.toLowerCase().includes(q) || n.subjectName.toLowerCase().includes(q) || n.sellerName.toLowerCase().includes(q)),
        transactions: data.transactions.filter((t: any) => t.transactionId.toLowerCase().includes(q) || t.buyerName.toLowerCase().includes(q)),
      }
    : null;

  return (
    <div className="min-h-screen bg-[#0D121F] text-stone-200 flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
              : 'bg-rose-950 text-rose-300 border-rose-500/50'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP BAR */}
      <header className="bg-[#121827] border-b border-stone-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#059669] to-emerald-400 p-0.5">
              <div className="w-full h-full bg-[#121827] rounded-[10px] flex items-center justify-center text-emerald-400 font-black text-sm">
                CX
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block leading-none">
                Single Admin System
              </span>
              <h1 className="text-sm font-black text-white leading-tight">Campux Master Portal</h1>
            </div>
          </div>
        </div>

        {/* Global Admin Search */}
        <div className="relative max-w-md w-full mx-6 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search Student, Mobile, UTR, Note, Seller, Txn ID..."
              className="w-full pl-10 pr-4 py-2 bg-[#0A0E18] border border-stone-800 rounded-xl text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {globalSearch && (
              <button
                onClick={() => {
                  setGlobalSearch('');
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showSearchResults && searchResults && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#161D2F] border border-stone-800 rounded-2xl shadow-2xl p-4 space-y-4 max-h-96 overflow-y-auto z-50">
              {/* Students */}
              {searchResults.students.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5">
                    Students ({searchResults.students.length})
                  </span>
                  <div className="space-y-1">
                    {searchResults.students.slice(0, 3).map((s: any) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedStudent(s);
                          setShowSearchResults(false);
                        }}
                        className="p-2 bg-[#0F1422] rounded-lg text-xs hover:bg-[#1A2238] cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-white block">{s.fullName}</span>
                          <span className="text-[10px] text-stone-400">{s.collegeName} • {s.mobile}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">View</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments / UTR */}
              {searchResults.payments.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5">
                    Payments / UTR ({searchResults.payments.length})
                  </span>
                  <div className="space-y-1">
                    {searchResults.payments.slice(0, 3).map((p: any) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPayment(p);
                          setActiveTab('payments');
                          setShowSearchResults(false);
                        }}
                        className="p-2 bg-[#0F1422] rounded-lg text-xs hover:bg-[#1A2238] cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-white block">UTR: {p.utrId} (₹{p.amount})</span>
                          <span className="text-[10px] text-stone-400">{p.buyerName} • {p.listingTitle}</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Review</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {searchResults.notes.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block mb-1.5">
                    Notes ({searchResults.notes.length})
                  </span>
                  <div className="space-y-1">
                    {searchResults.notes.slice(0, 3).map((n: any) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setSelectedListing(n);
                          setActiveTab('marketplace');
                          setShowSearchResults(false);
                        }}
                        className="p-2 bg-[#0F1422] rounded-lg text-xs hover:bg-[#1A2238] cursor-pointer flex justify-between items-center"
                      >
                        <div>
                          <span className="font-bold text-white block truncate max-w-xs">{n.title}</span>
                          <span className="text-[10px] text-stone-400">{n.subjectName} • ₹{n.price}</span>
                        </div>
                        <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">Manage</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            disabled={refreshing}
            className="p-2 rounded-xl bg-[#1A2238] border border-stone-700 text-stone-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Sync Data</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ACTION REQUIRED BANNER */}
      {(actionRequired.pendingPaymentsCount > 0 ||
        actionRequired.pendingListingsCount > 0 ||
        actionRequired.openReportsCount > 0 ||
        actionRequired.openTicketsCount > 0) && (
        <div className="bg-gradient-to-r from-amber-950/40 via-[#181E2F] to-amber-950/40 border-b border-amber-500/20 px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>ACTION REQUIRED:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {actionRequired.pendingPaymentsCount > 0 && (
              <button
                onClick={() => setActiveTab('payments')}
                className="bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                <span>{actionRequired.pendingPaymentsCount} Payments Awaiting Verification</span>
                <span className="underline ml-1">VIEW</span>
              </button>
            )}

            {actionRequired.pendingListingsCount > 0 && (
              <button
                onClick={() => setActiveTab('marketplace')}
                className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>{actionRequired.pendingListingsCount} Listings Awaiting Approval</span>
                <span className="underline ml-1">VIEW</span>
              </button>
            )}

            {actionRequired.openReportsCount > 0 && (
              <button
                onClick={() => setActiveTab('reports')}
                className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>{actionRequired.openReportsCount} Reports Pending</span>
                <span className="underline ml-1">VIEW</span>
              </button>
            )}

            {actionRequired.openTicketsCount > 0 && (
              <button
                onClick={() => setActiveTab('support')}
                className="bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>{actionRequired.openTicketsCount} Support Tickets</span>
                <span className="underline ml-1">VIEW</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* MAIN LAYOUT: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* UNIFIED ADMIN SIDEBAR */}
        <aside className="w-64 bg-[#121827] border-r border-stone-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 space-y-1 flex-1 text-xs">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'payments', label: 'Payments', icon: CreditCard, count: actionRequired.pendingPaymentsCount },
              { id: 'transactions', label: 'Transactions', icon: ReceiptText },
              { id: 'revenue', label: 'Revenue', icon: TrendingUp },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'colleges', label: 'Colleges', icon: Building2 },
              { id: 'academic', label: 'Academic Structure', icon: GraduationCap },
              { id: 'marketplace', label: 'Marketplace', icon: BookOpen, count: actionRequired.pendingListingsCount },
              { id: 'sellers', label: 'Sellers', icon: UserCheck },
              { id: 'reviews', label: 'Reviews', icon: Star },
              { id: 'study_groups', label: 'Study Groups', icon: Video },
              { id: 'announcements', label: 'Announcements', icon: Megaphone },
              { id: 'reports', label: 'Reports & Safety', icon: ShieldAlert, count: actionRequired.openReportsCount },
              { id: 'support', label: 'Support', icon: LifeBuoy, count: actionRequired.openTicketsCount },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'audit_logs', label: 'Audit Logs', icon: History },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'text-stone-400 hover:bg-[#1A2238] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count ? (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-black text-emerald-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-stone-800/80 text-[11px] text-stone-500">
            <span className="block font-bold text-stone-400">Authenticated Admin</span>
            <span>admin@campux.in</span>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-7xl">
          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Administrative Overview</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Live platform telemetry and real-time database state.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBroadcastModal(true)}
                    className="px-3.5 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 flex items-center gap-1.5 transition-colors"
                  >
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Broadcast Alert</span>
                  </button>
                </div>
              </div>

              {/* KPI Grid (All 11 Database Derived Metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Students', value: metrics.totalStudents, icon: Users, color: 'text-emerald-400' },
                  { label: 'Active Students', value: metrics.activeStudents, icon: UserCheck, color: 'text-emerald-400' },
                  { label: 'Total Colleges', value: metrics.totalColleges, icon: Building2, color: 'text-blue-400' },
                  { label: 'Total Notes Listed', value: metrics.totalNotes, icon: BookOpen, color: 'text-indigo-400' },
                  { label: 'Verified Purchases', value: metrics.totalPurchases, icon: ReceiptText, color: 'text-teal-400' },
                  { label: 'Total GMV (Txn Value)', value: `₹${metrics.totalTransactionValue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-amber-400' },
                  { label: 'Platform Net Revenue', value: `₹${metrics.platformRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-emerald-400' },
                  { label: 'Pending Verifications', value: metrics.pendingPaymentVerifications, icon: CreditCard, color: 'text-rose-400', highlight: true },
                  { label: 'Pending Listings', value: metrics.pendingListings, icon: Clock, color: 'text-amber-400' },
                  { label: 'Open Safety Reports', value: metrics.openReports, icon: ShieldAlert, color: 'text-orange-400' },
                  { label: 'Open Support Tickets', value: metrics.openSupportTickets, icon: LifeBuoy, color: 'text-sky-400' },
                  { label: 'Active Study Groups', value: metrics.activeStudyGroups, icon: Video, color: 'text-purple-400' },
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border bg-[#161D2F] space-y-2 ${
                        kpi.highlight && metrics.pendingPaymentVerifications > 0
                          ? 'border-rose-500/50 bg-rose-950/20'
                          : 'border-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-stone-400">
                        <span className="text-[11px] font-bold uppercase tracking-wider">{kpi.label}</span>
                        <Icon className={`w-4 h-4 ${kpi.color}`} />
                      </div>
                      <div className="text-2xl font-black text-white">{kpi.value}</div>
                    </div>
                  );
                })}
              </div>

              {/* Action Required Deep Dive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Payments Queue Preview */}
                <div className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">Payments Awaiting Verification</h3>
                      <p className="text-[11px] text-stone-400">Manual UPI screenshot & UTR submissions requiring manual review.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="text-xs font-bold text-emerald-400 hover:underline"
                    >
                      View All ({data.payments.filter((p: any) => p.status === 'submitted').length})
                    </button>
                  </div>

                  <div className="space-y-2">
                    {data.payments.filter((p: any) => p.status === 'submitted').slice(0, 4).map((p: any) => (
                      <div
                        key={p.id}
                        className="p-3 bg-[#0F1422] rounded-xl border border-stone-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{p.buyerName}</span>
                            <span className="text-[10px] text-stone-400 font-mono">UTR: {p.utrId}</span>
                            {p.isDuplicateFlagged && (
                              <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">
                                DUPLICATE UTR
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 block truncate max-w-xs">{p.listingTitle}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-emerald-400">₹{p.amount}</span>
                          <button
                            onClick={() => {
                              setSelectedPayment(p);
                              setActiveTab('payments');
                            }}
                            className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded-lg text-[11px] hover:bg-emerald-400 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                    {data.payments.filter((p: any) => p.status === 'submitted').length === 0 && (
                      <p className="text-xs text-stone-500 py-4 text-center">No pending payments. Verification queue is empty.</p>
                    )}
                  </div>
                </div>

                {/* Recent Audit Feed */}
                <div className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-sm">Recent Audit Trail</h3>
                      <p className="text-[11px] text-stone-400">Immutable record of administrative actions.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('audit_logs')}
                      className="text-xs font-bold text-emerald-400 hover:underline"
                    >
                      All Logs
                    </button>
                  </div>

                  <div className="space-y-2">
                    {data.auditLogs.slice(0, 5).map((log: any) => (
                      <div key={log.id} className="p-3 bg-[#0F1422] rounded-xl border border-stone-800/80 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-400">{log.action}</span>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-stone-300 text-[11px] leading-relaxed">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PAYMENTS (VERIFICATION QUEUE & REVIEW) */}
          {/* ========================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Payment Verification Management</h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Review student UPI payment screenshots & 12-digit UTR references. Approved payments unlock notes immediately.
                  </p>
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Order ID</th>
                        <th className="py-3.5 px-4">Buyer Student</th>
                        <th className="py-3.5 px-4">Resource</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">UTR Reference</th>
                        <th className="py-3.5 px-4">Screenshot</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.payments.map((p: any) => {
                        const isPending = p.status === 'submitted' || p.status === 'pending';
                        return (
                          <tr key={p.id} className="hover:bg-[#1A2238]/60 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-stone-300">{p.purchaseId.slice(-8)}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white block">{p.buyerName}</span>
                              <span className="text-[10px] text-stone-400">{p.buyerMobile}</span>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs truncate font-medium text-stone-200">
                              {p.listingTitle}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-emerald-400">₹{p.amount}</td>
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-bold text-white block">{p.utrId}</span>
                              {p.isDuplicateFlagged && (
                                <span className="text-[9px] bg-rose-500/20 text-rose-300 font-bold px-1 rounded block mt-0.5">
                                  Duplicate Flag
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => setSelectedPayment(p)}
                                className="w-10 h-10 rounded-lg overflow-hidden border border-stone-700 relative group block"
                              >
                                <img src={p.screenshotUrl} alt="Proof" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                                  <Eye className="w-3.5 h-3.5" />
                                </div>
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                              {new Date(p.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  p.status === 'verified'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : p.status === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300 animate-pulse'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedPayment(p)}
                                className="px-3 py-1.5 bg-[#1F293D] hover:bg-emerald-500 hover:text-black font-bold text-white rounded-xl transition-all text-xs"
                              >
                                Review
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: TRANSACTIONS */}
          {/* ========================================================================= */}
          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Transactions Ledger</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Complete financial log of all buyer payments, seller payouts, and platform revenue.</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={txnSearch}
                    onChange={(e) => setTxnSearch(e.target.value)}
                    placeholder="Filter by Txn ID, Buyer, Seller, Resource..."
                    className="w-full pl-9 pr-4 py-2 bg-[#161D2F] border border-stone-800 rounded-xl text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <select
                  value={txnStatusFilter}
                  onChange={(e) => setTxnStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#161D2F] border border-stone-800 rounded-xl text-xs text-stone-300 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="submitted">Submitted (Pending)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Ledger Table */}
              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Transaction ID</th>
                        <th className="py-3.5 px-4">Buyer</th>
                        <th className="py-3.5 px-4">Seller</th>
                        <th className="py-3.5 px-4">Resource</th>
                        <th className="py-3.5 px-4">Base</th>
                        <th className="py-3.5 px-4">Total Paid</th>
                        <th className="py-3.5 px-4">Platform Fee</th>
                        <th className="py-3.5 px-4">Seller Net</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.transactions
                        .filter((t: any) => {
                          const matches =
                            t.transactionId.toLowerCase().includes(txnSearch.toLowerCase()) ||
                            t.buyerName.toLowerCase().includes(txnSearch.toLowerCase()) ||
                            t.sellerName.toLowerCase().includes(txnSearch.toLowerCase()) ||
                            t.listingTitle.toLowerCase().includes(txnSearch.toLowerCase());
                          const matchesStatus = txnStatusFilter === 'all' || t.paymentStatus === txnStatusFilter;
                          return matches && matchesStatus;
                        })
                        .map((t: any) => (
                          <tr key={t.id} className="hover:bg-[#1A2238]/60 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-stone-300">{t.transactionId}</td>
                            <td className="py-3.5 px-4 font-bold text-white">{t.buyerName}</td>
                            <td className="py-3.5 px-4 text-stone-300">{t.sellerName}</td>
                            <td className="py-3.5 px-4 max-w-xs truncate text-stone-300 font-medium">{t.listingTitle}</td>
                            <td className="py-3.5 px-4 text-stone-400">₹{t.basePrice}</td>
                            <td className="py-3.5 px-4 font-bold text-white">₹{t.totalAmountPaid}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-400">₹{t.platformRevenue}</td>
                            <td className="py-3.5 px-4 font-bold text-sky-400">₹{t.sellerNetAmount}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  t.paymentStatus === 'verified' || t.paymentStatus === 'successful'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : t.paymentStatus === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {t.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                              {new Date(t.purchasedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: REVENUE */}
          {/* ========================================================================= */}
          {activeTab === 'revenue' && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-white">Financial & Revenue Analytics</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Real-time breakdown of gross GMV, platform fees, buyer convenience fees, and payouts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#161D2F] border border-stone-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Gross GMV (Volume)</span>
                  <div className="text-2xl font-black text-white">₹{data.revenueAnalytics.totalGMV.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] text-stone-500">Total payments transacted across platform</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#161D2F] border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Platform Revenue</span>
                  <div className="text-2xl font-black text-emerald-400">₹{data.revenueAnalytics.platformRevenue.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] text-stone-500">Collected from buyer & seller fees</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#161D2F] border border-stone-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Buyer Convenience Fees</span>
                  <div className="text-2xl font-black text-white">₹{data.revenueAnalytics.buyerFees.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] text-stone-500">₹2 fixed + 5% convenience per note</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#161D2F] border border-stone-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Study Group Commission</span>
                  <div className="text-2xl font-black text-white">₹{data.revenueAnalytics.studyGroupRevenue.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] text-stone-500">10% live peer session fee</span>
                </div>
              </div>

              {/* Revenue by College & Category Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm">Revenue Contribution by College</h3>
                  <div className="space-y-3">
                    {data.colleges.map((col: any) => {
                      const rev = data.revenueAnalytics.collegeRevenueMap[col.id] || 0;
                      const pct = data.revenueAnalytics.platformRevenue > 0 ? Math.round((rev / data.revenueAnalytics.platformRevenue) * 100) : 0;
                      return (
                        <div key={col.id} className="space-y-1 text-xs">
                          <div className="flex justify-between font-bold">
                            <span className="text-stone-300">{col.name}</span>
                            <span className="text-emerald-400">₹{rev} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-[#0F1422] h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(pct, 4)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 space-y-4">
                  <h3 className="font-bold text-white text-sm">Revenue by Academic Category</h3>
                  <div className="space-y-3">
                    {Object.entries(data.revenueAnalytics.categoryRevenueMap).map(([cat, amount]: any) => (
                      <div key={cat} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold">
                          <span className="text-stone-300">{cat}</span>
                          <span className="text-indigo-400">₹{amount}</span>
                        </div>
                        <div className="w-full bg-[#0F1422] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(8, Math.round((amount / (data.revenueAnalytics.platformRevenue || 1)) * 100)))}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {Object.keys(data.revenueAnalytics.categoryRevenueMap).length === 0 && (
                      <p className="text-xs text-stone-500 py-4 text-center">No categorized revenue records yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: STUDENTS */}
          {/* ========================================================================= */}
          {activeTab === 'students' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Student Directory & Profiles</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Manage registered students, view academic records, and handle suspensions.</p>
                </div>
              </div>

              {/* Student Search */}
              <div className="relative max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search student by name, mobile, or college..."
                  className="w-full pl-9 pr-4 py-2 bg-[#161D2F] border border-stone-800 rounded-xl text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Students Table */}
              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Student</th>
                        <th className="py-3.5 px-4">College & Course</th>
                        <th className="py-3.5 px-4">Year & Sec</th>
                        <th className="py-3.5 px-4">Purchases</th>
                        <th className="py-3.5 px-4">Sales</th>
                        <th className="py-3.5 px-4">Credibility</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.students
                        .filter(
                          (s: any) =>
                            s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                            s.mobile.includes(studentSearch) ||
                            s.collegeName.toLowerCase().includes(studentSearch.toLowerCase())
                        )
                        .map((s: any) => (
                          <tr key={s.id} className="hover:bg-[#1A2238]/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white block">{s.fullName}</span>
                              <span className="text-[10px] text-stone-400">{s.mobile}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-stone-300 block">{s.collegeName}</span>
                              <span className="text-[10px] text-stone-400">{s.courseName}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-stone-300">
                              Yr {s.year}, Sec {s.section || 'A'}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-stone-300">{s.totalPurchasesCount}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-400">{s.totalSalesCount}</td>
                            <td className="py-3.5 px-4">
                              <span className="bg-[#0F1422] border border-stone-700 px-2 py-0.5 rounded text-emerald-400 font-bold">
                                {s.credibilityScore} / 100
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  s.isSuspended ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {s.isSuspended ? (s.isBanned ? 'Banned' : 'Suspended') : 'Active'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <button
                                onClick={() => setSelectedStudent(s)}
                                className="px-2.5 py-1 bg-[#0F1422] hover:bg-stone-700 text-stone-200 font-bold rounded-lg text-[11px]"
                              >
                                View Profile
                              </button>
                              {s.isSuspended ? (
                                <button
                                  onClick={() => handleAction('RESTORE_STUDENT', s.id)}
                                  className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg text-[11px] font-bold"
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAction('SUSPEND_STUDENT', s.id, { reason: 'Policy violation' })}
                                  className="px-2.5 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg text-[11px] font-bold"
                                >
                                  Suspend
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* STUDENT PROFILE FULL MODAL */}
              {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Student Profile</span>
                        <h3 className="text-xl font-black text-white">{selectedStudent.fullName}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedStudent(null)}
                        className="w-8 h-8 rounded-full bg-[#0F1422] text-stone-400 hover:text-white flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-[#0F1422] p-4 rounded-2xl border border-stone-800 space-y-1">
                        <span className="text-stone-500 block">Mobile & Email</span>
                        <span className="font-bold text-white block">{selectedStudent.mobile}</span>
                        <span className="text-stone-400 block">{selectedStudent.email || 'N/A'}</span>
                      </div>
                      <div className="bg-[#0F1422] p-4 rounded-2xl border border-stone-800 space-y-1">
                        <span className="text-stone-500 block">Academic Enrollment</span>
                        <span className="font-bold text-white block">{selectedStudent.collegeName}</span>
                        <span className="text-stone-400 block">{selectedStudent.courseName} (Yr {selectedStudent.year}, Sec {selectedStudent.section})</span>
                      </div>
                      <div className="bg-[#0F1422] p-4 rounded-2xl border border-stone-800 space-y-1">
                        <span className="text-stone-500 block">Credibility & Rating</span>
                        <span className="font-bold text-emerald-400 text-base block">{selectedStudent.credibilityScore} / 100</span>
                        <span className="text-stone-400 block">Rating: ⭐ {selectedStudent.rating} ({selectedStudent.reviewCount} reviews)</span>
                      </div>
                    </div>

                    {/* Student Purchases & Sales */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider">Recent Activity & Resources</h4>
                      <div className="bg-[#0F1422] p-4 rounded-2xl border border-stone-800 space-y-2 text-xs">
                        <div className="flex justify-between text-stone-400 border-b border-stone-800 pb-2">
                          <span>Purchases ({selectedStudent.purchases?.length || 0})</span>
                          <span>Uploaded Listings ({selectedStudent.listings?.length || 0})</span>
                        </div>
                        {selectedStudent.listings?.slice(0, 3).map((l: any) => (
                          <div key={l.id} className="flex justify-between items-center py-1">
                            <span className="text-white truncate max-w-sm">{l.title}</span>
                            <span className="text-emerald-400 font-bold">₹{l.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                      {selectedStudent.isSuspended ? (
                        <button
                          onClick={async () => {
                            await handleAction('RESTORE_STUDENT', selectedStudent.id);
                            setSelectedStudent(null);
                          }}
                          className="px-4 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs"
                        >
                          Restore Account
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await handleAction('SUSPEND_STUDENT', selectedStudent.id, { isBanned: true, reason: 'Manual Ban by Admin' });
                            setSelectedStudent(null);
                          }}
                          className="px-4 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs"
                        >
                          Ban Student
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: COLLEGES */}
          {/* ========================================================================= */}
          {activeTab === 'colleges' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">College Communities Management</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Manage institutions, verified domains, and campus status.</p>
                </div>
                <button
                  onClick={() => setShowAddCollegeModal(true)}
                  className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add College</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.colleges.map((col: any) => (
                  <div key={col.id} className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{col.city}</span>
                        <h3 className="font-bold text-white text-base leading-tight mt-0.5">{col.name}</h3>
                        <span className="text-[11px] text-stone-400">{col.shortName}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          col.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-500/20 text-stone-400'
                        }`}
                      >
                        {col.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-stone-300">
                      <p className="truncate text-stone-400">{col.address}</p>
                      <p className="text-[11px] text-stone-500">Domains: {col.emailDomains?.join(', ')}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <button
                        onClick={() => handleAction('TOGGLE_COLLEGE_STATUS', col.id)}
                        className="text-xs font-bold text-stone-400 hover:text-white"
                      >
                        {col.status === 'active' ? 'Disable College' : 'Enable College'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD COLLEGE MODAL */}
              {showAddCollegeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                    <h3 className="text-base font-black text-white">Add New College</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">College Full Name</label>
                        <input
                          type="text"
                          value={newCollege.name}
                          onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                          placeholder="e.g. Stella Maris College"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Short Name / Acronym</label>
                        <input
                          type="text"
                          value={newCollege.shortName}
                          onChange={(e) => setNewCollege({ ...newCollege, shortName: e.target.value })}
                          placeholder="e.g. SMC"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">City</label>
                        <input
                          type="text"
                          value={newCollege.city}
                          onChange={(e) => setNewCollege({ ...newCollege, city: e.target.value })}
                          placeholder="Chennai"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Address</label>
                        <input
                          type="text"
                          value={newCollege.address}
                          onChange={(e) => setNewCollege({ ...newCollege, address: e.target.value })}
                          placeholder="Cathedral Road, Chennai"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Allowed Email Domains (comma separated)</label>
                        <input
                          type="text"
                          value={newCollege.emailDomains}
                          onChange={(e) => setNewCollege({ ...newCollege, emailDomains: e.target.value })}
                          placeholder="stellamariscollege.edu.in"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        onClick={() => setShowAddCollegeModal(false)}
                        className="px-4 py-2 bg-[#0F1422] text-stone-400 rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          const domains = newCollege.emailDomains.split(',').map((d) => d.trim()).filter(Boolean);
                          const ok = await handleAction('ADD_COLLEGE', undefined, { ...newCollege, emailDomains: domains });
                          if (ok) setShowAddCollegeModal(false);
                        }}
                        className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs"
                      >
                        Save College
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: ACADEMIC STRUCTURE */}
          {/* ========================================================================= */}
          {activeTab === 'academic' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Academic Curriculum Hierarchy</h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    College → Course → Year → Semester → Subject hierarchy powering search and cross-college matching.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="px-3.5 py-2 bg-[#1F293D] text-white rounded-xl text-xs font-bold hover:bg-stone-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Course</span>
                  </button>
                  <button
                    onClick={() => setShowAddSubjectModal(true)}
                    className="px-3.5 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Subject</span>
                  </button>
                </div>
              </div>

              {/* Subjects Table */}
              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Subject Name</th>
                        <th className="py-3.5 px-4">Course</th>
                        <th className="py-3.5 px-4">College</th>
                        <th className="py-3.5 px-4">Year / Sem</th>
                        <th className="py-3.5 px-4">Canonical Matching Key</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.subjects.map((sub: any) => {
                        const course = data.courses.find((c: any) => c.id === sub.courseId);
                        const col = data.colleges.find((c: any) => c.id === sub.collegeId);
                        return (
                          <tr key={sub.id} className="hover:bg-[#1A2238]/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white block">{sub.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono">{sub.code}</span>
                            </td>
                            <td className="py-3.5 px-4 text-stone-300">{course?.name || sub.courseId}</td>
                            <td className="py-3.5 px-4 text-stone-300">{col?.name || sub.collegeId}</td>
                            <td className="py-3.5 px-4 font-mono text-stone-300">Yr {sub.year}, Sem {sub.semester}</td>
                            <td className="py-3.5 px-4 font-mono text-emerald-400 text-[11px]">{sub.canonicalKey}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  sub.status !== 'disabled' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-500/20 text-stone-400'
                                }`}
                              >
                                {sub.status || 'active'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleAction('TOGGLE_SUBJECT_STATUS', sub.id)}
                                className="text-xs font-bold text-stone-400 hover:text-white"
                              >
                                Toggle
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ADD COURSE MODAL */}
              {showAddCourseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                    <h3 className="text-base font-black text-white">Add New Course</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">College</label>
                        <select
                          value={newCourse.collegeId}
                          onChange={(e) => setNewCourse({ ...newCourse, collegeId: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        >
                          {data.colleges.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Course Name</label>
                        <input
                          type="text"
                          value={newCourse.name}
                          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                          placeholder="e.g. B.Sc Data Science"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Course Code</label>
                        <input
                          type="text"
                          value={newCourse.code}
                          onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                          placeholder="e.g. BSC-DS"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button onClick={() => setShowAddCourseModal(false)} className="px-4 py-2 bg-[#0F1422] text-stone-400 rounded-xl text-xs font-bold">Cancel</button>
                      <button
                        onClick={async () => {
                          const ok = await handleAction('ADD_COURSE', undefined, newCourse);
                          if (ok) setShowAddCourseModal(false);
                        }}
                        className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs"
                      >
                        Save Course
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ADD SUBJECT MODAL */}
              {showAddSubjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                    <h3 className="text-base font-black text-white">Add New Subject</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">College</label>
                        <select
                          value={newSubject.collegeId}
                          onChange={(e) => setNewSubject({ ...newSubject, collegeId: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        >
                          {data.colleges.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Course</label>
                        <select
                          value={newSubject.courseId}
                          onChange={(e) => setNewSubject({ ...newSubject, courseId: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        >
                          {data.courses
                            .filter((c: any) => c.collegeId === newSubject.collegeId)
                            .map((c: any) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Subject Name</label>
                        <input
                          type="text"
                          value={newSubject.name}
                          onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                          placeholder="e.g. Corporate Accounting"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-stone-400 font-bold mb-1">Year</label>
                          <input
                            type="number"
                            value={newSubject.year}
                            onChange={(e) => setNewSubject({ ...newSubject, year: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 font-bold mb-1">Semester</label>
                          <input
                            type="number"
                            value={newSubject.semester}
                            onChange={(e) => setNewSubject({ ...newSubject, semester: Number(e.target.value) })}
                            className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button onClick={() => setShowAddSubjectModal(false)} className="px-4 py-2 bg-[#0F1422] text-stone-400 rounded-xl text-xs font-bold">Cancel</button>
                      <button
                        onClick={async () => {
                          const ok = await handleAction('ADD_SUBJECT', undefined, newSubject);
                          if (ok) setShowAddSubjectModal(false);
                        }}
                        className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs"
                      >
                        Save Subject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: MARKETPLACE (NOTES) */}
          {/* ========================================================================= */}
          {activeTab === 'marketplace' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Marketplace Resources Management</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Approve, reject, or moderate student note uploads across all Chennai campuses.</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="text"
                    value={notesSearch}
                    onChange={(e) => setNotesSearch(e.target.value)}
                    placeholder="Search by note title, subject, seller..."
                    className="w-full pl-9 pr-4 py-2 bg-[#161D2F] border border-stone-800 rounded-xl text-xs text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <select
                  value={notesStatusFilter}
                  onChange={(e) => setNotesStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-[#161D2F] border border-stone-800 rounded-xl text-xs text-stone-300 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active (Published)</option>
                  <option value="pending">Pending Review</option>
                  <option value="rejected">Rejected</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              {/* Marketplace Table */}
              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Resource</th>
                        <th className="py-3.5 px-4">Seller</th>
                        <th className="py-3.5 px-4">College</th>
                        <th className="py-3.5 px-4">Subject</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4">Sales</th>
                        <th className="py-3.5 px-4">Rating</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.marketplace
                        .filter((n: any) => {
                          const matches =
                            n.title.toLowerCase().includes(notesSearch.toLowerCase()) ||
                            n.subjectName.toLowerCase().includes(notesSearch.toLowerCase()) ||
                            n.sellerName.toLowerCase().includes(notesSearch.toLowerCase());
                          const matchesStatus = notesStatusFilter === 'all' || n.status === notesStatusFilter;
                          return matches && matchesStatus;
                        })
                        .map((n: any) => (
                          <tr key={n.id} className="hover:bg-[#1A2238]/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-white block max-w-xs truncate">{n.title}</span>
                              <span className="text-[10px] text-stone-400">{n.category} • {n.pageCount} pgs</span>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-stone-300">{n.sellerName}</td>
                            <td className="py-3.5 px-4 text-stone-300">{n.sellerCollegeId}</td>
                            <td className="py-3.5 px-4 text-stone-300">{n.subjectName}</td>
                            <td className="py-3.5 px-4 font-bold text-emerald-400">₹{n.price}</td>
                            <td className="py-3.5 px-4 font-bold text-white">{n.purchasesCount}</td>
                            <td className="py-3.5 px-4 text-amber-400 font-bold">⭐ {n.averageRating}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  n.status === 'active'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : n.status === 'rejected'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {n.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5">
                              {n.status !== 'active' && (
                                <button
                                  onClick={() => handleAction('APPROVE_LISTING', n.id)}
                                  className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded-lg text-[11px]"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                onClick={() => handleAction('TOGGLE_HIDE_LISTING', n.id)}
                                className="px-2.5 py-1 bg-[#0F1422] text-stone-300 hover:text-white rounded-lg text-[11px] font-bold"
                              >
                                {n.status === 'hidden' ? 'Show' : 'Hide'}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedListing(n);
                                  setShowListingRejectModal(true);
                                }}
                                className="px-2.5 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg text-[11px] font-bold"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* LISTING REJECT MODAL */}
              {showListingRejectModal && selectedListing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                    <h3 className="text-base font-black text-white">Reject Resource Upload</h3>
                    <p className="text-xs text-stone-400">Specify rejection reason for &quot;{selectedListing.title}&quot;:</p>
                    <textarea
                      value={listingRejectReason}
                      onChange={(e) => setListingRejectReason(e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-[#0F1422] border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button onClick={() => setShowListingRejectModal(false)} className="px-4 py-2 bg-[#0F1422] text-stone-400 rounded-xl text-xs font-bold">Cancel</button>
                      <button
                        onClick={async () => {
                          const ok = await handleAction('REJECT_LISTING', selectedListing.id, { reason: listingRejectReason });
                          if (ok) setShowListingRejectModal(false);
                        }}
                        className="px-5 py-2 bg-rose-500 text-white font-bold rounded-xl text-xs"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: SELLERS */}
          {/* ========================================================================= */}
          {activeTab === 'sellers' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-white">Seller Credibility & Payout Directory</h2>
                <p className="text-xs text-stone-400 mt-0.5">Top rankers, student creators, credibility score tracking, and net earnings.</p>
              </div>

              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Seller Name</th>
                        <th className="py-3.5 px-4">College</th>
                        <th className="py-3.5 px-4">Rating</th>
                        <th className="py-3.5 px-4">Credibility Score</th>
                        <th className="py-3.5 px-4">Notes Listed</th>
                        <th className="py-3.5 px-4">Sales Volume</th>
                        <th className="py-3.5 px-4">Gross Revenue</th>
                        <th className="py-3.5 px-4">Net Payout</th>
                        <th className="py-3.5 px-4">Account Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.sellers.map((sel: any) => (
                        <tr key={sel.sellerId} className="hover:bg-[#1A2238]/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white block">{sel.sellerName}</span>
                            <span className="text-[10px] text-stone-400">{sel.sellerMobile}</span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-300">{sel.sellerCollege}</td>
                          <td className="py-3.5 px-4 font-bold text-amber-400">⭐ {sel.rating} ({sel.reviewCount})</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                              {sel.credibilityScore} / 100
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-stone-200">{sel.resourcesListedCount}</td>
                          <td className="py-3.5 px-4 font-bold text-white">{sel.salesCount}</td>
                          <td className="py-3.5 px-4 font-bold text-stone-300">₹{sel.grossSales}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400">₹{sel.netEarnings}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                sel.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {sel.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 10: REVIEWS */}
          {/* ========================================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-white">Student Reviews & Ratings Moderation</h2>
                <p className="text-xs text-stone-400 mt-0.5">Verified purchaser reviews. Remove fraudulent or abusive comments.</p>
              </div>

              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Reviewer</th>
                        <th className="py-3.5 px-4">Rating</th>
                        <th className="py-3.5 px-4">Comment</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.reviews.map((r: any) => (
                        <tr key={r.id} className="hover:bg-[#1A2238]/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white block">{r.buyerName}</span>
                            <span className="text-[10px] text-stone-400">{r.buyerCollege}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-amber-400">⭐ {r.rating} / 5</td>
                          <td className="py-3.5 px-4 text-stone-300 max-w-md leading-relaxed">{r.comment}</td>
                          <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                            {new Date(r.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleAction('DELETE_REVIEW', r.id)}
                              className="px-2.5 py-1 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg text-[11px] font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 11: STUDY GROUPS */}
          {/* ========================================================================= */}
          {activeTab === 'study_groups' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-white">Live Study Sessions Management</h2>
                <p className="text-xs text-stone-400 mt-0.5">Peer tutoring, problem-solving workshops, and meeting link controls.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.studyGroups.map((g: any) => (
                  <div key={g.id} className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">{g.meetingPlatform}</span>
                        <h3 className="font-bold text-white text-base leading-tight mt-0.5">{g.title}</h3>
                        <span className="text-[11px] text-stone-400">Host: {g.hostName}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          g.status === 'live'
                            ? 'bg-rose-500/20 text-rose-300 animate-pulse'
                            : g.status === 'upcoming'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-stone-500/20 text-stone-400'
                        }`}
                      >
                        {g.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-stone-300">
                      <p>Subject: {g.subjectName}</p>
                      <p>Time: {g.date} at {g.startTime} ({g.durationMinutes} mins)</p>
                      <p className="font-bold text-emerald-400">Price: ₹{g.price} • Seats: {g.currentParticipantsCount} / {g.maxParticipants}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                      {g.status !== 'cancelled' ? (
                        <button
                          onClick={() => handleAction('UPDATE_STUDY_GROUP_STATUS', g.id, { status: 'cancelled' })}
                          className="font-bold text-rose-400 hover:underline"
                        >
                          Cancel Session
                        </button>
                      ) : (
                        <span className="text-stone-500">Cancelled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 12: ANNOUNCEMENTS */}
          {/* ========================================================================= */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Campus Opportunities & Announcements</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Publish symposia, competitions, club events, and academic workshops.</p>
                </div>
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Announcement</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.announcements.map((ann: any) => (
                  <div key={ann.id} className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {ann.category}
                      </span>
                      <button
                        onClick={() => handleAction('DELETE_ANNOUNCEMENT', ann.id)}
                        className="text-stone-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <h3 className="font-bold text-white text-base leading-tight">{ann.title}</h3>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{ann.description}</p>
                    </div>

                    <div className="space-y-1 text-xs text-stone-300 pt-2 border-t border-stone-800">
                      <p>College: {ann.collegeName}</p>
                      <p>Date: {ann.date} • {ann.time}</p>
                      <p className="text-stone-400">Venue: {ann.venueOrOnline}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CREATE ANNOUNCEMENT MODAL */}
              {showAnnouncementModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                    <h3 className="text-base font-black text-white">Create Campus Announcement</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Title</label>
                        <input
                          type="text"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          placeholder="e.g. Annual Commerce Symposium 2026"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Category</label>
                        <select
                          value={newAnnouncement.category}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        >
                          {['EVENT', 'CLUB', 'WORKSHOP', 'INTERNSHIP', 'COMPETITION', 'SEMINAR', 'OPPORTUNITY'].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Target College</label>
                        <select
                          value={newAnnouncement.collegeId}
                          onChange={(e) => {
                            const col = data.colleges.find((c: any) => c.id === e.target.value);
                            setNewAnnouncement({
                              ...newAnnouncement,
                              collegeId: e.target.value,
                              collegeName: col?.name || 'College',
                            });
                          }}
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        >
                          {data.colleges.map((c: any) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Description</label>
                        <textarea
                          value={newAnnouncement.description}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                          rows={3}
                          className="w-full p-2.5 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button onClick={() => setShowAnnouncementModal(false)} className="px-4 py-2 bg-[#0F1422] text-stone-400 rounded-xl text-xs font-bold">Cancel</button>
                      <button
                        onClick={async () => {
                          const ok = await handleAction('CREATE_ANNOUNCEMENT', undefined, newAnnouncement);
                          if (ok) setShowAnnouncementModal(false);
                        }}
                        className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs"
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 13: REPORTS & SAFETY */}
          {/* ========================================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-white">Trust, Safety & Community Reports</h2>
                <p className="text-xs text-stone-400 mt-0.5">Investigate copyright, spam, misleading resources, and academic misconduct claims.</p>
              </div>

              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Report ID</th>
                        <th className="py-3.5 px-4">Reporter</th>
                        <th className="py-3.5 px-4">Reason</th>
                        <th className="py-3.5 px-4">Description</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Action Taken</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.reports.map((rep: any) => (
                        <tr key={rep.id} className="hover:bg-[#1A2238]/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-300">#{rep.id}</td>
                          <td className="py-3.5 px-4 font-bold text-white">{rep.reporterName}</td>
                          <td className="py-3.5 px-4 font-bold text-orange-400">{rep.reason}</td>
                          <td className="py-3.5 px-4 text-stone-300 max-w-xs truncate">{rep.description}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                rep.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'
                              }`}
                            >
                              {rep.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-400">{rep.actionTaken || 'Pending review'}</td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {rep.status !== 'resolved' && (
                              <button
                                onClick={() => setSelectedReport(rep)}
                                className="px-2.5 py-1 bg-emerald-500 text-black font-bold rounded-lg text-[11px]"
                              >
                                Resolve
                              </button>
                            )}
                            <button
                              onClick={() => handleAction('DISMISS_REPORT', rep.id)}
                              className="px-2.5 py-1 bg-[#0F1422] text-stone-400 hover:text-white rounded-lg text-[11px] font-bold"
                            >
                              Dismiss
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RESOLVE REPORT MODAL */}
              {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                    <h3 className="text-base font-black text-white">Resolve Report #{selectedReport.id}</h3>
                    <p className="text-xs text-stone-400">Describe the resolution or action taken (e.g. warned student, updated note):</p>
                    <textarea
                      value={reportActionTaken}
                      onChange={(e) => setReportActionTaken(e.target.value)}
                      rows={3}
                      placeholder="e.g. Seller updated file to 2026 syllabus version."
                      className="w-full p-3 bg-[#0F1422] border border-stone-800 rounded-xl text-xs text-white focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button onClick={() => setSelectedReport(null)} className="px-4 py-2 bg-[#0F1422] text-stone-400 rounded-xl text-xs font-bold">Cancel</button>
                      <button
                        onClick={async () => {
                          const ok = await handleAction('RESOLVE_REPORT', selectedReport.id, { actionTaken: reportActionTaken });
                          if (ok) setSelectedReport(null);
                        }}
                        className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs"
                      >
                        Save & Resolve
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 14: SUPPORT */}
          {/* ========================================================================= */}
          {activeTab === 'support' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-white">Student Support Inbox</h2>
                <p className="text-xs text-stone-400 mt-0.5">Manage tickets for payments, note downloads, seller inquiries, and refunds.</p>
              </div>

              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Ticket</th>
                        <th className="py-3.5 px-4">Student</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Subject</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Created</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.supportTickets.map((tkt: any) => (
                        <tr key={tkt.id} className="hover:bg-[#1A2238]/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-300">#{tkt.id}</td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white block">{tkt.userName}</span>
                            <span className="text-[10px] text-stone-400">{tkt.userCollege}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-sky-400 uppercase text-[10px]">{tkt.category}</td>
                          <td className="py-3.5 px-4 font-medium text-stone-200 max-w-xs truncate">{tkt.subject}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                tkt.status === 'resolved' || tkt.status === 'closed'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-sky-500/20 text-sky-300'
                              }`}
                            >
                              {tkt.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                            {new Date(tkt.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedTicket(tkt)}
                              className="px-3 py-1 bg-emerald-500 text-black font-bold rounded-lg text-xs hover:bg-emerald-400"
                            >
                              Reply
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* REPLY TICKET MODAL */}
              {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-start border-b border-stone-800 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Support Ticket #{selectedTicket.id}</span>
                        <h3 className="text-base font-black text-white">{selectedTicket.subject}</h3>
                      </div>
                      <button onClick={() => setSelectedTicket(null)} className="text-stone-400 hover:text-white">✕</button>
                    </div>

                    <div className="bg-[#0F1422] p-4 rounded-2xl border border-stone-800 space-y-2 text-xs">
                      <span className="text-stone-400 block font-bold">{selectedTicket.userName} wrote:</span>
                      <p className="text-stone-200 leading-relaxed">{selectedTicket.description}</p>
                    </div>

                    {/* Replies thread */}
                    {selectedTicket.replies?.length > 0 && (
                      <div className="space-y-2">
                        {selectedTicket.replies.map((r: any) => (
                          <div
                            key={r.id}
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              r.sender === 'admin' ? 'bg-emerald-950/40 border border-emerald-500/30 ml-4' : 'bg-[#0F1422] border border-stone-800 mr-4'
                            }`}
                          >
                            <span className="font-bold text-white block">{r.senderName} ({r.sender})</span>
                            <p className="text-stone-300">{r.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2 text-xs">
                      <label className="block text-stone-400 font-bold">Admin Response</label>
                      <textarea
                        value={ticketReplyText}
                        onChange={(e) => setTicketReplyText(e.target.value)}
                        rows={3}
                        placeholder="Type official response to student..."
                        className="w-full p-3 bg-[#0F1422] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <select
                        value={ticketNewStatus}
                        onChange={(e) => setTicketNewStatus(e.target.value)}
                        className="px-3 py-1.5 bg-[#0F1422] border border-stone-800 rounded-xl text-xs text-stone-300"
                      >
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>

                      <button
                        onClick={async () => {
                          const ok = await handleAction('REPLY_SUPPORT_TICKET', selectedTicket.id, {
                            message: ticketReplyText,
                            newStatus: ticketNewStatus,
                          });
                          if (ok) {
                            setSelectedTicket(null);
                            setTicketReplyText('');
                          }
                        }}
                        className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs"
                      >
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 15: NOTIFICATIONS (BROADCAST) */}
          {/* ========================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Broadcast & Student Notifications</h2>
                  <p className="text-xs text-stone-400 mt-0.5">Send targeted announcements to individuals, college campuses, or all students.</p>
                </div>
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="px-4 py-2 bg-emerald-500 text-black rounded-xl text-xs font-bold hover:bg-emerald-400 flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Broadcast</span>
                </button>
              </div>

              {/* Sent Broadcasts History */}
              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-white text-sm">Dispatched Platform Alerts</h3>
                <div className="space-y-3">
                  {data.auditLogs
                    .filter((l: any) => l.action === 'BROADCAST_NOTIFICATION')
                    .map((b: any) => (
                      <div key={b.id} className="p-4 bg-[#0F1422] rounded-2xl border border-stone-800 space-y-1 text-xs">
                        <div className="flex justify-between font-bold">
                          <span className="text-emerald-400">{b.details}</span>
                          <span className="text-stone-500 text-[10px]">
                            {new Date(b.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* BROADCAST MODAL */}
              {showBroadcastModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
                  <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
                    <h3 className="text-base font-black text-white">Broadcast Platform Notification</h3>
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Target Audience</label>
                        <select
                          value={broadcastData.type}
                          onChange={(e) => setBroadcastData({ ...broadcastData, type: e.target.value })}
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        >
                          <option value="global">All Registered Students (Platform-Wide)</option>
                          <option value="college">Specific College</option>
                        </select>
                      </div>

                      {broadcastData.type === 'college' && (
                        <div>
                          <label className="block text-stone-400 font-bold mb-1">Select College</label>
                          <select
                            value={broadcastData.targetId}
                            onChange={(e) => setBroadcastData({ ...broadcastData, targetId: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                          >
                            <option value="">Choose College...</option>
                            {data.colleges.map((c: any) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Notification Title</label>
                        <input
                          type="text"
                          value={broadcastData.title}
                          onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                          placeholder="e.g. ⚠️ Semester Exam Model Papers Live"
                          className="w-full px-3 py-2 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-400 font-bold mb-1">Message Content</label>
                        <textarea
                          value={broadcastData.message}
                          onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                          rows={3}
                          placeholder="Type announcement message..."
                          className="w-full p-2.5 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button onClick={() => setShowBroadcastModal(false)} className="px-4 py-2 bg-[#0F1422] text-stone-400 rounded-xl text-xs font-bold">Cancel</button>
                      <button
                        onClick={async () => {
                          const ok = await handleAction('BROADCAST_NOTIFICATION', undefined, {
                            target: { type: broadcastData.type, targetId: broadcastData.targetId },
                            title: broadcastData.title,
                            message: broadcastData.message,
                          });
                          if (ok) setShowBroadcastModal(false);
                        }}
                        className="px-5 py-2 bg-emerald-500 text-black font-bold rounded-xl text-xs"
                      >
                        Send Broadcast
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 16: AUDIT LOGS */}
          {/* ========================================================================= */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-black text-white">Immutable Administrative Audit Log</h2>
                <p className="text-xs text-stone-400 mt-0.5">Chronological ledger recording all approvals, rejections, suspensions, and configuration edits.</p>
              </div>

              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F1422] text-stone-400 uppercase tracking-wider font-bold border-b border-stone-800 text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Timestamp</th>
                        <th className="py-3.5 px-4">Action</th>
                        <th className="py-3.5 px-4">Entity</th>
                        <th className="py-3.5 px-4">Details</th>
                        <th className="py-3.5 px-4">State Transition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {data.auditLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-[#1A2238]/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-stone-400 text-[11px]">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-stone-300">{log.entity}</td>
                          <td className="py-3.5 px-4 text-stone-200 max-w-md">{log.details}</td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400">
                            {log.previousStatus && log.newStatus ? `${log.previousStatus} → ${log.newStatus}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 17: SETTINGS & PLATFORM FEES */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && settingsForm && (
            <div className="space-y-8 animate-fadeIn max-w-4xl">
              <div>
                <h2 className="text-2xl font-black text-white">Platform Settings & Fee Architecture</h2>
                <p className="text-xs text-stone-400 mt-0.5">Database-configurable marketplace fee formulas and payment credentials.</p>
              </div>

              {/* PAYMENTS & FEES */}
              <div className="bg-[#161D2F] border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Payment & Dynamic Fee Settings</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-400 font-bold mb-1.5">UPI ID for Student Checkout</label>
                    <input
                      type="text"
                      value={settingsForm.upiId || 'campux@okaxis'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#0F1422] border border-stone-800 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-bold mb-1.5">UPI QR Code Image URL</label>
                    <input
                      type="text"
                      value={settingsForm.upiQrCodeUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiQrCodeUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 bg-[#0F1422] border border-stone-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-bold mb-1.5">Buyer Convenience Fee %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settingsForm.buyerFeePercentage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, buyerFeePercentage: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                    />
                    <span className="text-[10px] text-stone-500">e.g. 0.05 for 5%</span>
                  </div>

                  <div>
                    <label className="block text-stone-400 font-bold mb-1.5">Buyer Fixed Platform Fee (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.buyerFeeFixed}
                      onChange={(e) => setSettingsForm({ ...settingsForm, buyerFeeFixed: parseInt(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                    />
                    <span className="text-[10px] text-stone-500">e.g. ₹2 flat fee</span>
                  </div>

                  <div>
                    <label className="block text-stone-400 font-bold mb-1.5">Seller Platform Deduction %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settingsForm.sellerFeePercentage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, sellerFeePercentage: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                    />
                    <span className="text-[10px] text-stone-500">e.g. 0.10 for 10%</span>
                  </div>

                  <div>
                    <label className="block text-stone-400 font-bold mb-1.5">Study Group Fee %</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settingsForm.studyGroupFeePercentage || 0.1}
                      onChange={(e) => setSettingsForm({ ...settingsForm, studyGroupFeePercentage: parseFloat(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-[#0F1422] border border-stone-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex justify-end">
                  <button
                    onClick={async () => {
                      await handleAction('UPDATE_SETTINGS', undefined, settingsForm);
                    }}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20"
                  >
                    Save Platform Configuration
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* ROOT-LEVEL MODALS (z-[9999] - NEVER CLIPPED BY PARENT HEADERS/MAINS) */}
      {/* ========================================================================= */}

      {/* 1. REVIEW PAYMENT MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-[#161D2F] border border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] my-auto flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 p-5 sm:p-6 pb-4 bg-[#161D2F] shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Payment Verification Review
                </span>
                <h3 className="text-lg font-black text-white">Order {selectedPayment.purchaseId}</h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="w-8 h-8 rounded-full bg-[#0F1422] text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
              {/* Buyer & Resource Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#0F1422] p-4 rounded-2xl border border-stone-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Buyer Student</span>
                  <span className="font-bold text-white text-sm block">{selectedPayment.buyerName}</span>
                  <p className="text-stone-400">Mobile: {selectedPayment.buyerMobile}</p>
                  <p className="text-stone-400">College: {selectedPayment.buyerCollegeId}</p>
                </div>

                <div className="bg-[#0F1422] p-4 rounded-2xl border border-stone-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Resource & Price</span>
                  <span className="font-bold text-white text-sm block truncate">{selectedPayment.listingTitle}</span>
                  <p className="text-emerald-400 font-bold">Total Amount Paid: ₹{selectedPayment.amount}</p>
                  <p className="text-stone-400 font-mono">UTR Reference: {selectedPayment.utrId}</p>
                </div>
              </div>

              {/* Screenshot Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Payment Screenshot Proof
                  </span>
                  <span className="text-[10px] text-stone-500">UTR: {selectedPayment.utrId}</span>
                </div>
                <div className="bg-[#0F1422] p-3 rounded-2xl border border-stone-800 flex justify-center max-h-96 overflow-hidden">
                  <img
                    src={selectedPayment.screenshotUrl}
                    alt="Student UPI Screenshot"
                    className="max-h-88 object-contain rounded-xl shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Footer with Actions */}
            <div className="flex items-center justify-end gap-3 p-5 sm:p-6 pt-4 border-t border-stone-800 bg-[#121726] shrink-0">
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Reject Payment
              </button>

              <button
                type="button"
                onClick={() => setShowApproveModal(true)}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. APPROVE CONFIRMATION DIALOG */}
      {showApproveModal && selectedPayment && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#161D2F] border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center my-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white">Approve Payment Verification?</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to approve this payment of <strong>₹{selectedPayment.amount}</strong> for{' '}
              <strong>{selectedPayment.buyerName}</strong>? The notes will be permanently unlocked for download and platform revenue updated.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 bg-[#0F1422] text-stone-400 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const ok = await handleAction('APPROVE_PAYMENT', selectedPayment.id);
                  if (ok) {
                    setShowApproveModal(false);
                    setSelectedPayment(null);
                  }
                }}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs shadow-lg cursor-pointer"
              >
                Confirm & Unlock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. REJECT MODAL WITH REASON SELECTION */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#161D2F] border border-rose-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl my-auto">
            <h3 className="text-base font-black text-white">Select Payment Rejection Reason</h3>
            <p className="text-xs text-stone-400">
              The student will receive an immediate notification with this reason so they can rectify and resubmit.
            </p>

            <div className="space-y-2">
              {[
                'Invalid UTR',
                'Payment not received',
                'Wrong amount',
                'Duplicate UTR',
                'Screenshot unclear',
                'Incorrect payment',
                'Other',
              ].map((opt) => (
                <label
                  key={opt}
                  onClick={() => setRejectReason(opt)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    rejectReason === opt
                      ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                      : 'bg-[#0F1422] border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === opt}
                    onChange={() => setRejectReason(opt)}
                    className="hidden"
                  />
                  <div className={`w-3.5 h-3.5 rounded-full border ${rejectReason === opt ? 'bg-rose-500 border-rose-400' : 'border-stone-600'}`} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-[#0F1422] text-stone-400 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const ok = await handleAction('REJECT_PAYMENT', selectedPayment.id, { reason: rejectReason });
                  if (ok) {
                    setShowRejectModal(false);
                    setSelectedPayment(null);
                  }
                }}
                className="px-5 py-2 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
