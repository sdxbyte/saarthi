import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  HardHat,
  DollarSign,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Calendar,
  Send,
  Star,
  Layers,
  FileText,
  UserCheck
} from 'lucide-react';
import {
  getDevTrackProjects,
  getDevTrackStats,
  getCitizenProjectReports,
  submitCitizenProjectReport,
  formatNprCurrency,
  DevTrackProject,
  CitizenProjectReport
} from '../../services/devTrackService';

interface DevTrackProjectTrackerViewProps {
  currentLang: 'en' | 'ne';
}

export const DevTrackProjectTrackerView: React.FC<DevTrackProjectTrackerViewProps> = ({ currentLang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'projects' | 'reports'>('projects');

  // Selected project for inspection / filing report
  const [inspectProject, setInspectProject] = useState<DevTrackProject | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Form states for Citizen Report
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [issueCategory, setIssueCategory] = useState<CitizenProjectReport['issueCategory']>('Delay in Execution');
  const [reportDescription, setReportDescription] = useState('');
  const [formSubmittedMsg, setFormSubmittedMsg] = useState<string | null>(null);

  const stats = getDevTrackStats();
  const projects = getDevTrackProjects({
    searchTerm,
    category: selectedCategory,
    wardNumber: selectedWard,
    status: selectedStatus,
  });
  const reports = getCitizenProjectReports();

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectProject || !reportDescription.trim()) return;

    submitCitizenProjectReport({
      projectId: inspectProject.id,
      projectTitle: inspectProject.title,
      reporterName: reporterName || 'Anonymous Citizen',
      reporterPhone: reporterPhone || 'N/A',
      wardNumber: inspectProject.wardNumber,
      issueCategory,
      description: reportDescription,
    });

    setFormSubmittedMsg('✅ Citizen Project Quality Report submitted successfully! Logged in DevTrack Audit Trail.');
    setReportDescription('');
    setReporterName('');
    setReporterPhone('');

    setTimeout(() => {
      setFormSubmittedMsg(null);
      setShowReportModal(false);
    }, 2000);
  };

  const getStatusBadgeClass = (status: DevTrackProject['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'Delayed':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Tender Phase':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Under Audit':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* DevTrack Official Banner & Informational Portal */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wide">
              Municipal Project Tracking
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
              DevTrack System
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-emerald-400" />
            <span>
              {currentLang === 'ne'
                ? 'सरकारी विकास आयोजना अनुगमन पोर्टल (DevTrack)'
                : 'Municipal & Government Project Tracker (DevTrack)'}
            </span>
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentLang === 'ne'
              ? 'काठमाडौँ महानगरपालिका तथा नेपालका विकास निर्माण आयोजनाहरूको बजेट, प्रगति, ठेकेदार र गुणस्तर नागरिक अनुगमन गर्ने पारदर्शी प्रणाली।'
              : 'Direct citizen transparency portal for Nepal municipal development projects, physical & financial budgets, contractor oversight, dual AD/BS project schedules, and public audit reports.'}
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400 shrink-0 shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Live Municipal Telemetry</span>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Allocated Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            {formatNprCurrency(stats.totalBudgetAllocatedNpr)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Spent: {formatNprCurrency(stats.totalAmountSpentNpr)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Municipal Projects</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{stats.totalProjects} Projects</div>
          <div className="text-[10px] text-sky-400 mt-0.5 font-mono">
            {stats.activeWardsCount} Wards Covered
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Physical Progress</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-300 font-mono">{stats.avgPhysicalProgressPercent}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-500"
              style={{ width: `${stats.avgPhysicalProgressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Citizen Audit Reports</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-300 font-mono">{stats.citizenReportsCount} Reports</div>
          <div className="text-[10px] text-amber-400/80 mt-0.5 font-mono">
            {stats.delayedProjectsCount} Projects Flagged
          </div>
        </div>
      </div>

      {/* Tab Switcher & Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'projects' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'आयोजना सूची' : 'Development Projects'} ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'reports' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{currentLang === 'ne' ? 'नागरिक उजुरी तथा सुझाव' : 'Citizen Audit Reports'} ({reports.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono self-end sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DevTrack Synchronized • Dual AD/BS Dates</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={currentLang === 'ne' ? 'आयोजना वा ठेकेदार खोज्नुहोस्...' : 'Search projects or contractors...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Sectors & Categories</option>
              <option value="Smart City & Digital">Smart City & Digital</option>
              <option value="Roads & Bridges">Roads & Bridges</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Heritage & Tourism">Heritage & Tourism</option>
              <option value="Health & Education">Health & Education</option>
            </select>

            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="all">All Wards (काठमाडौँ महानगर)</option>
              <option value="1">Ward 1</option>
              <option value="6">Ward 6</option>
              <option value="10">Ward 10</option>
              <option value="11">Ward 11</option>
              <option value="15">Ward 15</option>
              <option value="24">Ward 24</option>
              <option value="31">Ward 31</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Progress Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Tender Phase">Tender Phase</option>
            </select>
          </div>
        )}
      </div>

      {/* Projects Grid List */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider" style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  }}>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${getStatusBadgeClass(p.status)}`}>
                      {p.status}
                    </span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {p.code}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-white leading-snug">
                    {currentLang === 'ne' ? p.titleNp : p.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{p.locationName} (Ward {p.wardNumber})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  {currentLang === 'ne' ? p.descriptionNp : p.description}
                </p>
              </div>

              {/* Progress Bars (Physical vs Financial) */}
              <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-bold">
                    <span className="text-slate-400">Physical Progress:</span>
                    <span className="text-purple-300 font-mono">{p.physicalProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${p.physicalProgressPercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1 font-bold">
                    <span className="text-slate-400">Financial Disbursement:</span>
                    <span className="text-emerald-300 font-mono">{p.financialProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${p.financialProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Timeline dual dates */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Allocated Budget</span>
                  <span className="text-emerald-400 font-bold">{formatNprCurrency(p.budgetAllocatedNpr)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Target Completion</span>
                  <span className="text-amber-300 font-bold">{p.targetCloseDateBs} B.S.</span>
                  <span className="text-slate-400 block text-[10px]">({p.targetCloseDateAd} A.D.)</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{p.qualityRating} / 5</span>
                  <span className="text-slate-500 font-mono text-[10px]">({p.citizenFeedbackCount} audits)</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setInspectProject(p);
                      setShowDetailModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <button
                    onClick={() => {
                      setInspectProject(p);
                      setShowReportModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Audit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reports List View */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reports.map((rep) => (
            <div key={rep.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                    {rep.issueCategory}
                  </span>
                  <span className="text-slate-400 font-bold">Ward {rep.wardNumber} Community Report</span>
                </div>
                <span className="text-slate-400 font-mono text-[10px]">
                  Submitted {rep.submittedBs} B.S. ({rep.submittedAd} A.D.)
                </span>
              </div>

              <h4 className="font-bold text-white text-sm">{rep.projectTitle}</h4>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
                "{rep.description}"
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Reporter: {rep.reporterName}</span>
                <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono text-[10px]">
                  Status: {rep.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Project Details Modal */}
      {showDetailModal && inspectProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded border text-[10px] font-mono font-bold ${getStatusBadgeClass(inspectProject.status)}`}>
                  {inspectProject.status}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  {inspectProject.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Ward {inspectProject.wardNumber} • {inspectProject.municipality}
                </span>
              </div>

              <h2 className="text-xl font-black text-white leading-tight">
                {currentLang === 'ne' ? inspectProject.titleNp : inspectProject.title}
              </h2>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{inspectProject.locationName}</span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Overview & Objectives</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {inspectProject.description}
              </p>
              <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1 border-t border-slate-800/60">
                {inspectProject.descriptionNp}
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Executing Department</span>
                <span className="font-bold text-white leading-snug block">{inspectProject.executingDepartment}</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Contractor</span>
                <span className="font-bold text-emerald-300 leading-snug block">{inspectProject.contractorName}</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 font-mono">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-sans block">Total Allocated Budget</span>
                <span className="font-bold text-emerald-400 text-sm block">{formatNprCurrency(inspectProject.budgetAllocatedNpr)}</span>
                <span className="text-[10px] text-slate-400 font-sans block">Disbursed: {formatNprCurrency(inspectProject.amountSpentNpr)} ({inspectProject.financialProgressPercent}%)</span>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 font-mono">
                <span className="text-[10px] text-slate-400 uppercase font-bold font-sans block">Dual Execution Timeline</span>
                <div className="text-[11px] text-slate-200">
                  <span className="text-slate-400">Start:</span> {inspectProject.startDateBs} BS ({inspectProject.startDateAd} AD)
                </div>
                <div className="text-[11px] text-amber-300 font-bold">
                  <span className="text-slate-400 font-normal">Target:</span> {inspectProject.targetCloseDateBs} BS ({inspectProject.targetCloseDateAd} AD)
                </div>
              </div>
            </div>

            {/* Progress Gauges */}
            <div className="space-y-3 bg-slate-950/90 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-slate-300">Physical Progress Complete:</span>
                  <span className="text-purple-300 font-mono">{inspectProject.physicalProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${inspectProject.physicalProgressPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span className="text-slate-300">Financial Disbursement Progress:</span>
                  <span className="text-emerald-300 font-mono">{inspectProject.financialProgressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${inspectProject.financialProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quality Rating & Action Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{inspectProject.qualityRating} / 5</span>
                </div>
                <span className="text-slate-500 font-mono text-[11px]">({inspectProject.citizenFeedbackCount} Citizen Audits Logged)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowReportModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Submit Quality Audit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit & Grievance Modal */}
      {showReportModal && inspectProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">
                DevTrack Community Oversight
              </span>
              <h2 className="text-lg font-black text-white">Log Project Quality Audit / Grievance</h2>
              <p className="text-xs text-slate-400 font-mono">{inspectProject.code} • {inspectProject.title}</p>
            </div>

            {formSubmittedMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                {formSubmittedMsg}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Audit Category</label>
                  <select
                    value={issueCategory}
                    onChange={(e) => setIssueCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Delay in Execution">Delay in Execution</option>
                    <option value="Substandard Material">Substandard Construction Material</option>
                    <option value="Safety Hazard">Safety Hazard to Pedestrians</option>
                    <option value="Budget Discrepancy">Budget Discrepancy</option>
                    <option value="Environmental Damage">Environmental Damage</option>
                    <option value="General Feedback">General Appreciation / Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Citizen Details (Optional)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Mobile Phone"
                      value={reporterPhone}
                      onChange={(e) => setReporterPhone(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Observation & Report Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe specific observations regarding construction quality, delays, safety hazards, or contractor performance..."
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Audit to DevTrack</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
