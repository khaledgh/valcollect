import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getLeads, updateLeadStatus, deleteLead, exportLeadsExcel, importLeadsExcel,
  getEnrollments, updateEnrollmentStatus, deleteEnrollment, exportEnrollmentsExcel,
  getMessages, updateMessageStatus, deleteMessage,
  getAnalytics, getMe,
} from '../../api/client';
import {
  LayoutDashboard, Users, BookOpen, UserPlus, Layout, MessageSquare,
  Search, RefreshCcw, CheckCircle, Download, Upload, Trash2,
  LogOut, Eye, Mail, TrendingUp, FileSpreadsheet,
} from 'lucide-react';

import LandingPageManager from './LandingPageManager';

type Tab = 'dashboard' | 'leads' | 'enrollments' | 'pages' | 'messages';

interface AnalyticsData {
  total_views: number;
  today_views: number;
  total_leads: number;
  total_enrollments: number;
  total_messages: number;
  unread_messages: number;
  lead_sources: Array<{ source: string; count: number }>;
  top_pages: Array<{ path: string; views: number }>;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Data states
  const [leads, setLeads] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [leadFilter, setLeadFilter] = useState({ status: '', source: '', search: '' });
  const [enrollFilter, setEnrollFilter] = useState({ status: '', search: '' });
  const [msgFilter, setMsgFilter] = useState({ status: '', search: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('valcollect_token');
    if (!token) { navigate('/admin/login'); return; }
    const stored = localStorage.getItem('valcollect_user');
    if (stored) setUser(JSON.parse(stored));
    getMe().catch(() => { localStorage.removeItem('valcollect_token'); navigate('/admin/login'); });
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const r = await getAnalytics();
        setAnalytics(r.data);
      } else if (activeTab === 'leads') {
        const r = await getLeads(leadFilter);
        setLeads(r.data || []);
      } else if (activeTab === 'enrollments') {
        const r = await getEnrollments(enrollFilter);
        setEnrollments(r.data || []);
      } else if (activeTab === 'messages') {
        const r = await getMessages(msgFilter);
        setMessages(r.data || []);
      }
    } catch { /* fallback handled */ }
    setLoading(false);
  }, [activeTab, leadFilter, enrollFilter, msgFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const logout = () => {
    localStorage.removeItem('valcollect_token');
    localStorage.removeItem('valcollect_user');
    navigate('/admin/login');
  };

  const handleExportLeads = async () => {
    try {
      const res = await exportLeadsExcel(leadFilter);
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'leads_export.xlsx'; a.click();
    } catch { alert('Export failed'); }
  };

  const handleImportLeads = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importLeadsExcel(file);
      alert(res.data.message);
      fetchData();
    } catch { alert('Import failed'); }
    e.target.value = '';
  };

  const handleExportEnrollments = async () => {
    try {
      const res = await exportEnrollmentsExcel();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'enrollments_export.xlsx'; a.click();
    } catch { alert('Export failed'); }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="admin-ltr min-h-screen bg-[#f4f6fa] flex font-sans text-sm">
      {/* ===== SIDEBAR ===== */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 z-40 transform transition-transform duration-300 lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#16c66c] to-[#141b24] rounded-xl shadow-lg shadow-emerald-500/25" />
            <div><span className="font-black text-gray-800 text-base">Valcollect</span><span className="text-[9px] text-gray-400 block -mt-0.5 font-bold tracking-widest uppercase">Admin Panel</span></div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <SidebarBtn icon={<LayoutDashboard size={17}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} />
          <SidebarBtn icon={<UserPlus size={17}/>} label="Leads" active={activeTab === 'leads'} count={leads.length} onClick={() => { setActiveTab('leads'); setSidebarOpen(false); }} />
          <SidebarBtn icon={<Users size={17}/>} label="Enrollments" active={activeTab === 'enrollments'} onClick={() => { setActiveTab('enrollments'); setSidebarOpen(false); }} />
          <SidebarBtn icon={<Layout size={17}/>} label="Landing Pages" active={activeTab === 'pages'} onClick={() => { setActiveTab('pages'); setSidebarOpen(false); }} />
          <SidebarBtn icon={<MessageSquare size={17}/>} label="Messages" active={activeTab === 'messages'} badge={unreadCount || undefined} onClick={() => { setActiveTab('messages'); setSidebarOpen(false); }} />
        </nav>
        {user && (
          <div className="p-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 text-[#16c66c] rounded-lg flex items-center justify-center font-bold text-xs">{user.full_name?.[0] || 'A'}</div>
              <div className="flex-1 min-w-0"><div className="text-xs font-bold text-gray-800 truncate">{user.full_name || 'Admin'}</div><div className="text-[10px] text-gray-400">{user.role}</div></div>
              <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><LogOut size={15}/></button>
            </div>
          </div>
        )}
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ===== MAIN ===== */}
      <main className="flex-1 lg:ml-60 min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 h-14 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <h1 className="text-base font-bold text-gray-800 capitalize">{activeTab === 'dashboard' ? 'Analytics Dashboard' : activeTab}</h1>
          </div>
          <button onClick={fetchData} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg" title="Refresh">
            <RefreshCcw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        <div className="p-4 md:p-6">
          {/* ===== DASHBOARD TAB ===== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Total Views" value={analytics?.total_views || 0} icon={<Eye size={18}/>} color="#16c66c" />
                <KpiCard label="Today Views" value={analytics?.today_views || 0} icon={<TrendingUp size={18}/>} color="#3b82f6" />
                <KpiCard label="Total Leads" value={analytics?.total_leads || 0} icon={<UserPlus size={18}/>} color="#10b981" />
                <KpiCard label="Enrollments" value={analytics?.total_enrollments || 0} icon={<BookOpen size={18}/>} color="#f59e0b" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Messages" value={analytics?.total_messages || 0} icon={<Mail size={18}/>} color="#6366f1" />
                <KpiCard label="Unread" value={analytics?.unread_messages || 0} icon={<MessageSquare size={18}/>} color="#ef4444" />
                <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Lead Sources</h3>
                  <div className="space-y-2">
                    {(analytics?.lead_sources || []).map((s: any, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{s.source}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#16c66c] rounded-full" style={{ width: `${Math.min(100, (s.count / Math.max(1, analytics?.total_leads || 0)) * 100)}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-800">{s.count}</span>
                        </div>
                      </div>
                    ))}
                    {(!analytics?.lead_sources || analytics.lead_sources.length === 0) && <p className="text-xs text-gray-400">No data yet</p>}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Top Pages</h3>
                <div className="space-y-2">
                  {(analytics?.top_pages || []).map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-gray-600 font-medium">{p.path}</span>
                      <span className="text-xs font-bold text-[#16c66c]">{p.count} views</span>
                    </div>
                  ))}
                  {(!analytics?.top_pages || analytics.top_pages.length === 0) && <p className="text-xs text-gray-400">No data yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* ===== LEADS TAB ===== */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    <input type="text" placeholder="Search leads..." className="bg-white border border-gray-200 pl-8 pr-3 py-2 rounded-lg text-xs outline-none focus:border-[#16c66c] w-48" value={leadFilter.search} onChange={e => setLeadFilter({...leadFilter, search: e.target.value})} />
                  </div>
                  <select className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-[#16c66c]" value={leadFilter.status} onChange={e => setLeadFilter({...leadFilter, status: e.target.value})}>
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-[#16c66c]" value={leadFilter.source} onChange={e => setLeadFilter({...leadFilter, source: e.target.value})}>
                    <option value="">All Sources</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google">Google</option>
                    <option value="Direct">Direct</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.xls" onChange={handleImportLeads} />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <Upload size={13}/> Import
                  </button>
                  <button onClick={handleExportLeads} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                    <Download size={13}/> Export
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Contact</th>
                        <th className="px-4 py-3 hidden lg:table-cell">City</th>
                        <th className="px-4 py-3">Source</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {leads.map(l => (
                        <tr key={l.ID} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 bg-emerald-50 text-[#16c66c] rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0">{(l.first_name?.[0] || '')}{(l.last_name?.[0] || '')}</div>
                              <div><div className="font-semibold text-gray-800">{l.first_name} {l.last_name}</div><div className="text-[10px] text-gray-400 md:hidden">{l.email}</div></div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell"><div className="text-gray-600">{l.email}</div><div className="text-[10px] text-gray-400">{l.phone}</div></td>
                          <td className="px-4 py-3 hidden lg:table-cell text-gray-500">{l.city || '-'}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-semibold">{l.source || 'Direct'}</span></td>
                          <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                          <td className="px-4 py-3 hidden sm:table-cell text-gray-400 text-[10px]">{new Date(l.CreatedAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-0.5">
                              {l.status !== 'confirmed' && <button onClick={() => updateLeadStatus(l.ID, 'confirmed').then(fetchData)} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded" title="Confirm"><CheckCircle size={14}/></button>}
                              {l.status === 'confirmed' && <button onClick={() => updateLeadStatus(l.ID, 'pending').then(fetchData)} className="p-1 text-amber-500 hover:bg-amber-50 rounded" title="Reset"><RefreshCcw size={12}/></button>}
                              <button onClick={() => { if (confirm('Delete this lead?')) deleteLead(l.ID).then(fetchData); }} className="p-1 text-red-400 hover:bg-red-50 rounded" title="Delete"><Trash2 size={14}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {leads.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-gray-400">No leads found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== ENROLLMENTS TAB ===== */}
          {activeTab === 'enrollments' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    <input type="text" placeholder="Search..." className="bg-white border border-gray-200 pl-8 pr-3 py-2 rounded-lg text-xs outline-none focus:border-[#16c66c] w-48" value={enrollFilter.search} onChange={e => setEnrollFilter({...enrollFilter, search: e.target.value})} />
                  </div>
                  <select className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs" value={enrollFilter.status} onChange={e => setEnrollFilter({...enrollFilter, status: e.target.value})}>
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Success">Success</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <button onClick={handleExportEnrollments} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50">
                  <FileSpreadsheet size={13}/> Export Excel
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3 hidden md:table-cell">Email</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Payment</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {enrollments.map(e => (
                        <tr key={e.ID} className="hover:bg-gray-50/50">
                          <td className="px-4 py-3 font-semibold text-gray-800">{e.student_name}</td>
                          <td className="px-4 py-3 hidden md:table-cell text-gray-500">{e.student_email}</td>
                          <td className="px-4 py-3">#{e.course_id}</td>
                          <td className="px-4 py-3"><StatusBadge status={e.payment_status} /></td>
                          <td className="px-4 py-3 hidden sm:table-cell text-gray-400 text-[10px]">{new Date(e.CreatedAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-0.5">
                              {e.payment_status !== 'Success' && <button onClick={() => updateEnrollmentStatus(e.ID, 'Success').then(fetchData)} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded"><CheckCircle size={14}/></button>}
                              <button onClick={() => { if (confirm('Delete?')) deleteEnrollment(e.ID).then(fetchData); }} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {enrollments.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-gray-400">No enrollments found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== LANDING PAGES TAB ===== */}
          {activeTab === 'pages' && (
            <LandingPageManager />
          )}

          {/* ===== MESSAGES TAB ===== */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    <input type="text" placeholder="Search messages..." className="bg-white border border-gray-200 pl-8 pr-3 py-2 rounded-lg text-xs outline-none focus:border-[#16c66c] w-48" value={msgFilter.search} onChange={e => setMsgFilter({...msgFilter, search: e.target.value})} />
                  </div>
                  <select className="bg-white border border-gray-200 px-3 py-2 rounded-lg text-xs" value={msgFilter.status} onChange={e => setMsgFilter({...msgFilter, status: e.target.value})}>
                    <option value="">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                {messages.map(m => (
                  <div key={m.ID} className={`bg-white rounded-xl border p-5 transition-all ${m.status === 'unread' ? 'border-[#16c66c]/30 shadow-sm' : 'border-gray-100'}`}>
                    <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${m.status === 'unread' ? 'bg-[#16c66c] text-white' : 'bg-gray-100 text-gray-500'}`}>{m.name?.[0] || '?'}</div>
                        <div>
                          <div className="font-bold text-gray-800 text-xs">{m.name}</div>
                          <div className="text-[10px] text-gray-400">{m.email} آ· {new Date(m.CreatedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MsgBadge status={m.status} />
                        <div className="flex gap-0.5">
                          {m.status === 'unread' && <button onClick={() => updateMessageStatus(m.ID, 'read').then(fetchData)} className="p-1 text-blue-500 hover:bg-blue-50 rounded" title="Mark read"><Eye size={14}/></button>}
                          {m.status !== 'replied' && <button onClick={() => updateMessageStatus(m.ID, 'replied').then(fetchData)} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded" title="Mark replied"><CheckCircle size={14}/></button>}
                          <button onClick={() => { if (confirm('Delete?')) deleteMessage(m.ID).then(fetchData); }} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-700 mb-1">{m.subject}</div>
                    <p className="text-xs text-gray-500 leading-relaxed">{m.message}</p>
                  </div>
                ))}
                {messages.length === 0 && <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-gray-100"><MessageSquare className="mx-auto mb-3 text-gray-300" size={32}/><p>No messages</p></div>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* ===== SUBCOMPONENTS ===== */

const SidebarBtn = ({ icon, label, active, onClick, count, badge }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${active ? 'bg-emerald-50 text-[#16c66c] font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}>
    {icon}<span className="flex-1 text-left">{label}</span>
    {count !== undefined && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-[#16c66c] text-white' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
    {badge !== undefined && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white animate-pulse">{badge}</span>}
  </button>
);

const KpiCard = ({ label, value, icon, color }: any) => (
  <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
    <div><div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{label}</div><div className="text-xl font-black text-gray-800 mt-1">{value.toLocaleString()}</div></div>
    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15', color }}>{icon}</div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.toLowerCase();
  const isGreen = s === 'confirmed' || s === 'success';
  const isRed = s === 'rejected' || s === 'failed';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${isGreen ? 'bg-emerald-50 text-emerald-600' : isRed ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
      <span className={`w-1 h-1 rounded-full ${isGreen ? 'bg-emerald-500' : isRed ? 'bg-red-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
};

const MsgBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { unread: 'bg-emerald-50 text-[#16c66c]', read: 'bg-blue-50 text-blue-600', replied: 'bg-emerald-50 text-emerald-600' };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${colors[status] || 'bg-gray-50 text-gray-500'}`}>{status}</span>;
};

export default AdminDashboard;
