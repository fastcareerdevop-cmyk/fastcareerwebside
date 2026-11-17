import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { 
  Users, Building2, Download, MapPin, GraduationCap, 
  FileText, Search, PlusCircle, X, Building, Mail, User, UserCheck, FileSpreadsheet,
  Trash2, Phone, Award, CheckCircle2, RefreshCw, Eye, Briefcase,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import api from '../../services/api';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { getResumeUrl } from '../../utils/urlHelper';
import { fetchCandidateResumeBlob, viewCandidateResume } from '../../utils/clientPdfGenerator';
import { 
  formatCandidateForExcel, 
  downloadCandidatesExcel,
  formatCandidateTo16Columns,
  downloadFormatted16FieldExcel 
} from '../../utils/excelExportHelper';

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  isFresherCA?: boolean;
  isExperienced?: boolean;
  caPortfolio?: {
    isFresherCA?: boolean;
    natureOfWork?: string;
    articleshipFirm?: string;
    articleshipCity?: string;
    big4Articleship?: string;
  };
  experienceInfo?: {
    isExperienced?: boolean;
    experienceYears?: string;
    currentCompanyName?: string;
    currentDesignation?: string;
    workProfile?: string;
    currentCTC?: string;
    expectedCTC?: string;
    noticePeriod?: string;
  };
  experience?: any;
  personalDetails?: {
    currentCity?: string;
    currentState?: string;
  };
  qualifications?: {
    graduation?: {
      courseName?: string;
      collegeName?: string;
      yearOfCompletion?: string;
    };
  };
  createdAt: string;
}

interface Employer {
  _id: string;
  companyName?: string;
  firstName: string;
  lastName?: string;
  email: string;
  createdAt?: string;
}

export const AdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Company Modal State
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'register' | 'list'>('register');
  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    hrName: '',
    email: '',
    password: 'Company@123',
  });
  const [creatingCompany, setCreatingCompany] = useState(false);

  // Tab State: 'freshers' | 'experienced' | 'industrial'
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'freshers' | 'experienced' | 'industrial'>(() => {
    const tab = searchParams.get('tab');
    if (tab === 'industrial') return 'industrial';
    if (tab === 'experienced') return 'experienced';
    return 'freshers';
  });
  const [isIndustrialModalOpen, setIsIndustrialModalOpen] = useState(false);
  const [industrialList, setIndustrialList] = useState<any[]>([]);
  const [loadingIndustrial, setLoadingIndustrial] = useState(false);
  const [industrialSearch, setIndustrialSearch] = useState('');
  const [industrialBatchFilter, setIndustrialBatchFilter] = useState('');
  const [industrialAttemptFilter, setIndustrialAttemptFilter] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'industrial') {
      setActiveTab('industrial');
    } else if (tab === 'experienced') {
      setActiveTab('experienced');
    } else if (tab === 'freshers' || tab === 'candidates') {
      setActiveTab('freshers');
    }
  }, [searchParams]);

  const fetchIndustrialApplications = async () => {
    try {
      setLoadingIndustrial(true);
      const res = await api.get('/industrial-training');
      setIndustrialList(res.data?.data || []);
    } catch (e) {
      console.error('Error fetching industrial training applications:', e);
    } finally {
      setLoadingIndustrial(false);
    }
  };

  const handleExportIndustrialExcel = async () => {
    try {
      const res = await api.get('/industrial-training/export', { responseType: 'blob' });
      saveAs(res.data, `Industrial_Training_Candidates_${Date.now()}.xlsx`);
      toast.success('Downloaded Industrial Training Excel Sheet! ✓');
    } catch (e) {
      toast.error('Failed to export Industrial Training spreadsheet.');
    }
  };

  const handleDeleteIndustrial = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete Industrial Training record for "${name}"?`)) return;
    try {
      await api.delete(`/industrial-training/${id}`);
      toast.success('Record deleted successfully.');
      setIndustrialList(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      toast.error('Failed to delete record.');
    }
  };

  const handleDeleteCandidate = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete candidate "${name}"? This action will remove their profile and applications permanently.`)) return;
    try {
      await api.delete(`/users/candidates/${id}`);
      toast.success(`Candidate "${name}" deleted successfully.`);
      setCandidates(prev => prev.filter(item => item._id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete candidate.');
    }
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/candidates');
      setCandidates(res.data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployers = async () => {
    try {
      const res = await api.get('/users/employers');
      setEmployers(res.data || []);
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchCandidates();
      fetchEmployers();
      fetchIndustrialApplications();
    }
  }, [user]);

  // Create Company Handler (Database Registration)
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyForm.companyName || !companyForm.hrName || !companyForm.email) {
      toast.error('Please fill in Company Name, HR Name, and Login Email.');
      return;
    }

    setCreatingCompany(true);
    try {
      await api.post('/users', {
        companyName: companyForm.companyName,
        firstName: companyForm.hrName,
        lastName: '',
        email: companyForm.email,
        password: companyForm.password || 'Company@123',
        role: 'employer',
      });

      toast.success(`Company "${companyForm.companyName}" registered in Database!`);
      setCompanyForm({ 
        companyName: '',
        hrName: '', 
        email: '', 
        password: 'Company@123' 
      });
      fetchEmployers();
      setActiveModalTab('list');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register company.');
    } finally {
      setCreatingCompany(false);
    }
  };

  // Helper to accurately classify experienced vs fresher candidates
  const isCandidateExperienced = (c: Candidate): boolean => {
    return Boolean(
      c.isExperienced === true ||
      c.experienceInfo?.isExperienced === true ||
      (c as any).workExperience?.isExperienced === true ||
      c.caPortfolio?.isFresherCA === false ||
      c.isFresherCA === false ||
      (c.experienceInfo?.experienceYears && 
        c.experienceInfo.experienceYears !== '0' && 
        c.experienceInfo.experienceYears !== 'Fresher' &&
        c.experienceInfo.experienceYears !== '0-1 Years' &&
        !c.experienceInfo.experienceYears.toLowerCase().includes('fresher')
      ) ||
      (c.experienceInfo?.currentCompanyName && c.experienceInfo.currentCompanyName.trim().length > 0) ||
      (Array.isArray(c.experience) && c.experience.length > 0)
    );
  };

  const fresherCandidates = candidates.filter(c => !isCandidateExperienced(c));
  const experiencedCandidates = candidates.filter(c => isCandidateExperienced(c));

  // Determine active candidate set based on tab
  const activeCandidatesList = activeTab === 'experienced'
    ? experiencedCandidates
    : fresherCandidates;

  // Filter candidates by search query
  const filteredCandidates = activeCandidatesList.filter(candidate => {
    const fullName = `${candidate.firstName || ''} ${candidate.lastName || ''}`.toLowerCase();
    const email = (candidate.email || '').toLowerCase();
    const city = (candidate.personalDetails?.currentCity || '').toLowerCase();
    const company = (candidate.experienceInfo?.currentCompanyName || '').toLowerCase();
    const designation = (candidate.experienceInfo?.currentDesignation || '').toLowerCase();
    const q = searchQuery.toLowerCase();

    return (
      fullName.includes(q) || 
      email.includes(q) || 
      city.includes(q) ||
      company.includes(q) ||
      designation.includes(q)
    );
  });

  // Filter industrial training applications
  const filteredIndustrial = industrialList.filter(app => {
    if (industrialBatchFilter && app.caInterBatch !== industrialBatchFilter) return false;
    if (industrialAttemptFilter && app.bothGroups1stAttempt !== industrialAttemptFilter) return false;
    if (!industrialSearch) return true;
    const q = industrialSearch.toLowerCase();
    return (
      (app.name || '').toLowerCase().includes(q) ||
      (app.email || '').toLowerCase().includes(q) ||
      (app.phone || '').toLowerCase().includes(q) ||
      (app.articleshipFirmName || '').toLowerCase().includes(q) ||
      (app.currentLocation || '').toLowerCase().includes(q) ||
      (app.currentState || '').toLowerCase().includes(q) ||
      (app.caInterRank || '').toLowerCase().includes(q)
    );
  });

  // ── Custom Pagination (10 candidates per page) ──
  const [currentPage, setCurrentPage] = useState(1);
  const [industrialPage, setIndustrialPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    setIndustrialPage(1);
  }, [industrialSearch, industrialBatchFilter, industrialAttemptFilter]);

  const totalCandidatePages = Math.max(1, Math.ceil(filteredCandidates.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCandidates.length);
  const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

  const totalIndustrialPages = Math.max(1, Math.ceil(filteredIndustrial.length / itemsPerPage));
  const startIndIndex = (industrialPage - 1) * itemsPerPage;
  const endIndIndex = Math.min(startIndIndex + itemsPerPage, filteredIndustrial.length);
  const paginatedIndustrial = filteredIndustrial.slice(startIndIndex, endIndIndex);

  const renderPagination = (
    currPage: number, 
    total: number, 
    totalItems: number, 
    onPageChange: (p: number) => void,
    start: number,
    end: number
  ) => {
    if (totalItems === 0) return null;

    const pages: (number | string)[] = [];
    if (total <= 6) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currPage > 3) pages.push('...');
      const startP = Math.max(2, currPage - 1);
      const endP = Math.min(total - 1, currPage + 1);
      for (let i = startP; i <= endP; i++) pages.push(i);
      if (currPage < total - 2) pages.push('...');
      pages.push(total);
    }

    return (
      <div className="p-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{totalItems > 0 ? start + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-800">{end}</span> of{' '}
          <span className="font-bold text-slate-800">{totalItems}</span> candidates
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(1, currPage - 1))}
            disabled={currPage === 1}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
              currPage === 1
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 bg-white'
            }`}
          >
            <ChevronLeft size={13} /> Prev
          </button>

          {pages.map((p, idx) => (
            typeof p === 'number' ? (
              <button
                key={idx}
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  currPage === p
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border border-slate-200 bg-white'
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-slate-400 font-bold select-none">…</span>
            )
          ))}

          <button
            onClick={() => onPageChange(Math.min(total, currPage + 1))}
            disabled={currPage === total}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
              currPage === total
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 bg-white'
            }`}
          >
            Next <ChevronRight size={13} />
          </button>
        </div>
      </div>
    );
  };

  const handleBulkDownload = async () => {
    // ── Handle Industrial Training Tab Bulk Download ──
    if (activeTab === 'industrial') {
      const currentList = filteredIndustrial.length > 0 ? filteredIndustrial : industrialList;
      if (currentList.length === 0) {
        toast.error('No industrial training candidates available to download.');
        return;
      }

      setDownloading(true);
      try {
        const zip = new JSZip();

        // 1. Standardized 16-field Excel
        const formatted16Data = currentList.map(formatCandidateTo16Columns);
        const ws16 = XLSX.utils.json_to_sheet(formatted16Data);
        const wb16 = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb16, ws16, "Industrial 16 Format");
        const excelBuffer16 = XLSX.write(wb16, { bookType: 'xlsx', type: 'array' });
        zip.file("Industrial_Training_16_Format.xlsx", excelBuffer16);

        // 2. Resumes Folder
        const resumesFolder = zip.folder("Resumes");
        if (resumesFolder) {
          const nameCountTracker = new Map<string, number>();
          const fetchPromises = currentList.map(async (app) => {
            try {
              const candidateObj = {
                ...app,
                firstName: app.name?.split(' ')[0] || app.name || 'Candidate',
                lastName: app.name?.split(' ').slice(1).join(' ') || '',
                personalDetails: {
                  currentCity: app.currentLocation,
                  currentState: app.currentState,
                  permanentCity: app.permanentLocation,
                  permanentState: app.permanentState,
                  dateOfBirth: app.dob,
                  gender: app.gender,
                  phone: app.phone
                },
                caPortfolio: {
                  isFresherCA: true,
                  caInter: {
                    completionSessionMonth: app.caInterBatch?.split(' ')[0] || '',
                    completionSessionYear: app.caInterBatch?.split(' ')[1] || app.caInterBatch || '',
                    bothGroups1stAttempt: app.bothGroups1stAttempt === 'Yes',
                    group1Attempts: app.group1 === '1st Attempt' ? '1' : app.group1,
                    group2Attempts: app.group2 === '1st Attempt' ? '1' : app.group2,
                    ranker: app.caInterRank || 'No Rank'
                  },
                  articleships: [
                    {
                      firmName: app.articleshipFirmName,
                      startDate: app.articleshipStartMonthYear
                    }
                  ]
                }
              };

              const blob = await fetchCandidateResumeBlob(candidateObj);
              const sanitize = (s: string) => (s || '').replace(/[/\\?%*:|"<>_]/g, ' ').replace(/\s+/g, ' ').trim();
              const base = sanitize(app.name || 'Candidate');
              const currentCount = nameCountTracker.get(base) || 0;
              nameCountTracker.set(base, currentCount + 1);
              const fileName = currentCount === 0 ? `${base}.pdf` : `${base} (${currentCount + 1}).pdf`;

              resumesFolder.file(fileName, blob);
            } catch (err) {
              console.error(`Failed to fetch resume for ${app.name}:`, err);
            }
          });
          await Promise.all(fetchPromises);
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, "Industrial_Training_Resumes.zip");
        toast.success('Industrial Training ZIP package downloaded successfully!');
      } catch (error) {
        console.error('Error generating industrial bulk download:', error);
        toast.error('Failed to generate bulk download.');
      } finally {
        setDownloading(false);
      }
      return;
    }

    // ── Handle Regular Candidates (Freshers / Experienced) ──
    if (filteredCandidates.length === 0) {
      toast.error('No candidates available to download.');
      return;
    }
    
    setDownloading(true);
    try {
      const zip = new JSZip();
      
      const excelData = filteredCandidates.map((c, idx) => formatCandidateForExcel(c, idx));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates Database");
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      zip.file("Candidates_50_Format_Data.xlsx", excelBuffer);

      // Also include the standard 16-field format in the ZIP
      const formatted16Data = filteredCandidates.map(formatCandidateTo16Columns);
      const ws16 = XLSX.utils.json_to_sheet(formatted16Data);
      const wb16 = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb16, ws16, "16-Field Format");
      const excelBuffer16 = XLSX.write(wb16, { bookType: 'xlsx', type: 'array' });
      zip.file("Candidates_16_Columns_Format.xlsx", excelBuffer16);

      const resumesFolder = zip.folder("Resumes");
      if (resumesFolder) {
        const nameCountTracker = new Map<string, number>();
        const fetchPromises = filteredCandidates.map(async (candidate) => {
          try {
            const blob = await fetchCandidateResumeBlob(candidate);
            const sanitize = (s: string) => (s || '').replace(/[/\\?%*:|"<>_]/g, ' ').replace(/\s+/g, ' ').trim();
            const fName = sanitize(candidate.firstName || '');
            const lName = sanitize(candidate.lastName || '');
            const base = [fName, lName].filter(Boolean).join(' ') || 'Candidate';
            
            const currentCount = nameCountTracker.get(base) || 0;
            nameCountTracker.set(base, currentCount + 1);
            const fileName = currentCount === 0 ? `${base}.pdf` : `${base} (${currentCount + 1}).pdf`;

            resumesFolder.file(fileName, blob);
          } catch (error) {
            console.error(`Failed to fetch resume for ${candidate.firstName}:`, error);
          }
        });
        await Promise.all(fetchPromises);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, "Candidates_Data_and_Resumes.zip");
      toast.success('ZIP package downloaded successfully!');
    } catch (error) {
      console.error('Error generating bulk download:', error);
      toast.error('Failed to generate bulk download.');
    } finally {
      setDownloading(false);
    }
  };

  const handleExportExcel = () => {
    if (activeTab === 'industrial') {
      const list = filteredIndustrial.length > 0 ? filteredIndustrial : industrialList;
      if (list.length === 0) {
        toast.error('No industrial candidates available to export.');
        return;
      }
      try {
        downloadFormatted16FieldExcel(list, 'Industrial_Training_16_Format');
        toast.success('Downloaded 16-field Industrial Training Excel successfully!');
      } catch (error) {
        console.error('Error exporting Excel:', error);
        toast.error('Failed to export Excel.');
      }
      return;
    }

    if (filteredCandidates.length === 0) {
      toast.error('No candidates available to export.');
      return;
    }
    try {
      downloadCandidatesExcel(filteredCandidates, activeTab === 'experienced' ? 'Experienced_Candidates_50_Format' : 'Fresher_Candidates_50_Format');
      toast.success('Downloaded 50-field Candidates Excel sheet successfully!');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Failed to export Excel.');
    }
  };

  const handleExportCustomFormatExcel = () => {
    if (activeTab === 'industrial') {
      const list = filteredIndustrial.length > 0 ? filteredIndustrial : industrialList;
      if (!list || list.length === 0) {
        toast.error('No industrial candidates available to export.');
        return;
      }
      try {
        downloadFormatted16FieldExcel(list, 'Industrial_Training_16_Format');
        toast.success('Downloaded 16-field Industrial Training Excel sheet successfully!');
      } catch (error) {
        console.error('Error exporting formatted Excel:', error);
        toast.error('Failed to export formatted Excel.');
      }
    } else {
      const list = filteredCandidates.length > 0 ? filteredCandidates : activeCandidatesList;
      if (!list || list.length === 0) {
        toast.error('No candidates available to export.');
        return;
      }
      try {
        downloadCandidatesExcel(list, activeTab === 'experienced' ? 'Experienced_Candidates_50_Format' : 'Fresher_Candidates_50_Format');
        toast.success('Downloaded 50-field formatted Candidates Excel sheet successfully!');
      } catch (error) {
        console.error('Error exporting formatted Excel:', error);
        toast.error('Failed to export formatted Excel.');
      }
    }
  };

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-5 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="text-indigo-600" /> Candidates Database
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review registered candidates, search profiles, and export resume packages.
          </p>
        </div>

        {/* Buttons in ONE single line */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap overflow-x-auto max-w-full pb-1">
          {user?.role !== 'employee' && (
            <>
              <button
                onClick={() => {
                  setActiveModalTab('register');
                  setIsCompanyModalOpen(true);
                }}
                className="whitespace-nowrap inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                title="Register New Company"
              >
                <Building2 size={13} /> New Company
              </button>

              <Link
                to="/admin/add-employee"
                className="whitespace-nowrap inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                title="Manage Employees"
              >
                <UserCheck size={13} /> Employees
              </Link>
            </>
          )}

          <button 
            onClick={() => {
              fetchIndustrialApplications();
              setIsIndustrialModalOpen(true);
            }}
            className="whitespace-nowrap inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer shrink-0"
            title="View CA Industrial Training Applications"
          >
            <GraduationCap size={13} /> Industrial Training {industrialList.length > 0 && `(${industrialList.length})`}
          </button>

          <button 
            onClick={handleExportExcel}
            className="whitespace-nowrap inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            title="Download Excel spreadsheet with all candidate details"
          >
            <FileSpreadsheet size={13} /> Export Excel
          </button>

          <button 
            onClick={handleBulkDownload}
            disabled={downloading}
            className={`whitespace-nowrap inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              downloading ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white shadow-2xs cursor-pointer'
            }`}
            title="Export resumes ZIP package"
          >
            <Download size={13} /> {downloading ? 'Generating ZIP...' : 'Export ZIP'}
          </button>

          <button 
            onClick={handleExportCustomFormatExcel}
            className="whitespace-nowrap inline-flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
            title="Download Excel spreadsheet in the exact 16 standardized columns"
          >
            <FileSpreadsheet size={13} /> Format Excel
          </button>
        </div>
      </div>

      {/* Quick KPI Stat Cards (Compact Size) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <button
          onClick={() => { setActiveTab('freshers'); setSearchParams({}); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'freshers'
              ? 'bg-indigo-50/70 border-indigo-500 shadow-sm ring-2 ring-indigo-200'
              : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">CA Freshers</p>
              <h3 className="text-xl font-black text-indigo-700 mt-0.5">{fresherCandidates.length}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <Users size={16} />
            </div>
          </div>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1.5">View Freshers Database →</p>
        </button>

        <button
          onClick={() => { setActiveTab('experienced'); setSearchParams({ tab: 'experienced' }); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'experienced'
              ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Experienced Candidates</p>
              <h3 className="text-xl font-black text-emerald-700 mt-0.5">{experiencedCandidates.length}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Briefcase size={16} />
            </div>
          </div>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1.5">View Experienced CAs →</p>
        </button>

        <button
          onClick={() => { setActiveTab('industrial'); setSearchParams({ tab: 'industrial' }); }}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            activeTab === 'industrial'
              ? 'bg-amber-50/70 border-amber-500 shadow-sm ring-2 ring-amber-200'
              : 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1">
                <p className="text-[11px] font-semibold text-slate-500">Industrial Training</p>
                <span className="text-[8px] font-black bg-amber-500 text-white px-1 py-0.2 rounded-full uppercase">HOT</span>
              </div>
              <h3 className="text-xl font-black text-amber-600 mt-0.5">{industrialList.length}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <GraduationCap size={16} />
            </div>
          </div>
          <p className="text-[10px] text-amber-700 font-semibold mt-1.5">View 16-Field Submissions →</p>
        </button>

        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">Registered Companies</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">{employers.length}</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 size={16} />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">Hiring partner profiles</p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto">
        <button
          onClick={() => { setActiveTab('freshers'); setSearchParams({}); }}
          className={`flex-1 min-w-[180px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'freshers'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users size={16} />
          <span>CA Freshers</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'freshers' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
          }`}>
            {fresherCandidates.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('experienced'); setSearchParams({ tab: 'experienced' }); }}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'experienced'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Briefcase size={16} />
          <span>Experienced Candidates</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'experienced' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {experiencedCandidates.length}
          </span>
        </button>

        <button
          onClick={() => { setActiveTab('industrial'); setSearchParams({ tab: 'industrial' }); }}
          className={`flex-1 min-w-[240px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'industrial'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <GraduationCap size={16} />
          <span>CA Industrial Training Form Applications</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'industrial' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {industrialList.length}
          </span>
        </button>
      </div>

      {/* TAB 1 & 2: Freshers & Experienced Candidates Table */}
      {(activeTab === 'freshers' || activeTab === 'experienced') && (
        <>
          {/* Search Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder={activeTab === 'experienced' ? "Search experienced by name, company, designation, city..." : "Search freshers by name, email, or city..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredCandidates.length} of {activeCandidatesList.length} {activeTab === 'experienced' ? 'Experienced Candidates' : 'CA Freshers'}
            </div>
          </div>

          {/* Candidates Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Candidate</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">{activeTab === 'experienced' ? 'Experience & Role' : 'Education'}</th>
                    <th className="px-6 py-4 font-semibold">Registered On</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        Loading candidate database...
                      </td>
                    </tr>
                  ) : filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                        No {activeTab === 'experienced' ? 'experienced candidates' : 'CA freshers'} found.
                      </td>
                    </tr>
                  ) : (
                    paginatedCandidates.map((candidate) => (
                      <tr key={candidate._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase shrink-0 ${
                              activeTab === 'experienced' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                            }`}>
                              {(candidate.firstName?.[0] || 'C')}{(candidate.lastName?.[0] || '')}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                <span>{candidate.firstName} {candidate.lastName}</span>
                                {activeTab === 'experienced' && candidate.experienceInfo?.experienceYears && (
                                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                    {candidate.experienceInfo.experienceYears}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">{candidate.email}</div>
                              {candidate.phone && <div className="text-xs text-slate-400">{candidate.phone}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-xs">
                          {candidate.personalDetails?.currentCity ? (
                            <div className="flex items-center gap-1">
                              <MapPin size={14} className="text-slate-400" /> 
                              {candidate.personalDetails.currentCity}, {candidate.personalDetails.currentState || ''}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-xs">
                          {activeTab === 'experienced' ? (
                            candidate.experienceInfo?.currentCompanyName ? (
                              <div className="space-y-0.5">
                                <div className="font-semibold text-slate-800 flex items-center gap-1">
                                  <Briefcase size={14} className="text-emerald-600 shrink-0" />
                                  <span>{candidate.experienceInfo.currentDesignation || 'Designation N/A'}</span>
                                </div>
                                <div className="text-slate-600 font-medium">{candidate.experienceInfo.currentCompanyName}</div>
                                {candidate.experienceInfo.currentCTC && (
                                  <div className="text-[11px] text-slate-400">CTC: {candidate.experienceInfo.currentCTC}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Experience details not filled</span>
                            )
                          ) : (
                            candidate.qualifications?.graduation?.collegeName ? (
                              <div>
                                <div className="font-semibold text-slate-800 flex items-center gap-1">
                                  <GraduationCap size={14} className="text-indigo-500" /> 
                                  {candidate.qualifications.graduation.courseName || 'Graduation'}
                                </div>
                                <div className="text-slate-500">
                                  {candidate.qualifications.graduation.collegeName} ({candidate.qualifications.graduation.yearOfCompletion})
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Not provided</span>
                            )
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(candidate.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {candidate.resumeUrl ? (
                              <button 
                                onClick={() => viewCandidateResume(candidate)} 
                                className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <FileText size={14} /> View CV
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Not uploaded</span>
                            )}
                            <button
                              onClick={() => handleDeleteCandidate(candidate._id, `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || candidate.email)}
                              className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                              title="Delete Candidate"
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Custom Pagination for Candidates (10 per page) */}
            {renderPagination(currentPage, totalCandidatePages, filteredCandidates.length, setCurrentPage, startIndex, endIndex)}
          </div>
        </>
      )}

      {/* TAB 2: CA Industrial Training Form Applications */}
      {activeTab === 'industrial' && (
        <div className="space-y-4">
          {/* Industrial Filter & Action Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by candidate name, email, phone, firm, city, or state..."
                value={industrialSearch}
                onChange={(e) => setIndustrialSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={industrialBatchFilter}
                onChange={(e) => setIndustrialBatchFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All CA Inter Batches</option>
                {Array.from(new Set(industrialList.map(a => a.caInterBatch).filter(Boolean))).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={industrialAttemptFilter}
                onChange={(e) => setIndustrialAttemptFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Attempts</option>
                <option value="Yes">1st Attempt: Yes</option>
                <option value="No">1st Attempt: No</option>
              </select>

              <button
                onClick={handleExportIndustrialExcel}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                title="Download 16-field Excel spreadsheet"
              >
                <FileSpreadsheet size={15} /> Download Excel
              </button>

              <button
                onClick={fetchIndustrialApplications}
                className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                title="Refresh"
              >
                <RefreshCw size={15} className={loadingIndustrial ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Industrial Training Applications Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold tracking-wider">
                    <th className="px-3.5 py-3.5">#</th>
                    <th className="px-3.5 py-3.5">Candidate</th>
                    <th className="px-3.5 py-3.5">Contact</th>
                    <th className="px-3.5 py-3.5">Current Location</th>
                    <th className="px-3.5 py-3.5">Permanent Location</th>
                    <th className="px-3.5 py-3.5">CA Inter Batch</th>
                    <th className="px-3.5 py-3.5">1st Attempt?</th>
                    <th className="px-3.5 py-3.5">Group 1 & 2</th>
                    <th className="px-3.5 py-3.5">Rank</th>
                    <th className="px-3.5 py-3.5">Articleship Firm</th>
                    <th className="px-3.5 py-3.5">Start Date</th>
                    <th className="px-3.5 py-3.5">Status</th>
                    <th className="px-3.5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingIndustrial ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                          <span>Loading Industrial Training form submissions...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredIndustrial.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-slate-500">
                        {industrialList.length === 0 ? (
                          <div>
                            <GraduationCap size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="font-semibold text-slate-700">No Industrial Training forms submitted yet.</p>
                            <p className="text-xs text-slate-400 mt-1">
                              When candidates fill the Industrial Training form from the navbar or login page, their submissions will appear here.
                            </p>
                          </div>
                        ) : (
                          <p className="text-slate-500">No records match your search filter.</p>
                        )}
                      </td>
                    </tr>
                  ) : (
                    paginatedIndustrial.map((app, idx) => (
                      <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-3.5 py-3 text-slate-400 font-mono text-[11px]">{startIndIndex + idx + 1}</td>
                        <td className="px-3.5 py-3">
                          <div className="font-bold text-slate-900">{app.name}</div>
                          <div className="text-[10px] text-slate-500">{app.gender || '—'} • DOB: {app.dob || '—'}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          <a
                            href={`https://wa.me/91${app.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-bold text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Phone size={11} /> {app.phone}
                          </a>
                          <div className="text-slate-500 text-[11px] truncate max-w-[150px]" title={app.email}>
                            {app.email}
                          </div>
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="font-semibold text-slate-800">{app.currentLocation || '—'}</div>
                          <div className="text-[10px] text-slate-500">{app.currentState || '—'}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          <div className="text-slate-700">{app.permanentLocation || '—'}</div>
                          <div className="text-[10px] text-slate-500">{app.permanentState || '—'}</div>
                        </td>
                        <td className="px-3.5 py-3 font-semibold text-blue-700">
                          {app.caInterBatch}
                        </td>
                        <td className="px-3.5 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            app.bothGroups1stAttempt === 'Yes'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {app.bothGroups1stAttempt || 'No'}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-[11px]">
                          <div>G1: {app.group1 || '—'}</div>
                          <div>G2: {app.group2 || '—'}</div>
                        </td>
                        <td className="px-3.5 py-3">
                          {app.caInterRank && app.caInterRank !== 'No Rank' && app.caInterRank !== 'No' ? (
                            <span className="font-bold text-amber-700 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                              {app.caInterRank}
                            </span>
                          ) : (
                            <span className="text-slate-400">No Rank</span>
                          )}
                        </td>
                        <td className="px-3.5 py-3 font-semibold text-slate-900 max-w-[140px] truncate" title={app.articleshipFirmName}>
                          {app.articleshipFirmName}
                        </td>
                        <td className="px-3.5 py-3 text-slate-600">
                          {app.articleshipStartMonthYear}
                        </td>
                        <td className="px-3.5 py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <CheckCircle2 size={10} /> {app.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-3.5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const candidateObj = {
                                  ...app,
                                  firstName: app.name?.split(' ')[0] || app.name || 'Candidate',
                                  lastName: app.name?.split(' ').slice(1).join(' ') || '',
                                  personalDetails: {
                                    currentCity: app.currentLocation,
                                    currentState: app.currentState,
                                    permanentCity: app.permanentLocation,
                                    permanentState: app.permanentState,
                                    dateOfBirth: app.dob,
                                    gender: app.gender,
                                    phone: app.phone
                                  },
                                  caPortfolio: {
                                    isFresherCA: true,
                                    caInter: {
                                      completionSessionMonth: app.caInterBatch?.split(' ')[0] || '',
                                      completionSessionYear: app.caInterBatch?.split(' ')[1] || app.caInterBatch || '',
                                      bothGroups1stAttempt: app.bothGroups1stAttempt === 'Yes',
                                      group1Attempts: app.group1 === '1st Attempt' ? '1' : app.group1,
                                      group2Attempts: app.group2 === '1st Attempt' ? '1' : app.group2,
                                      ranker: app.caInterRank || 'No Rank'
                                    },
                                    articleships: [
                                      {
                                        firmName: app.articleshipFirmName,
                                        startDate: app.articleshipStartMonthYear
                                      }
                                    ]
                                  }
                                };
                                viewCandidateResume(candidateObj);
                              }}
                              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                              title="View Candidate CV"
                            >
                              <FileText size={12} /> View CV
                            </button>
                            <button
                              onClick={() => handleDeleteIndustrial(app._id, app.name)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Custom Pagination for Industrial Training (10 per page) */}
            {renderPagination(industrialPage, totalIndustrialPages, filteredIndustrial.length, setIndustrialPage, startIndIndex, endIndIndex)}
          </div>
        </div>
      )}

      {/* Register & Manage Companies Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Register New Company</h2>
                  <p className="text-xs text-slate-500">Create company credentials to store in database</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCompanyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-3 bg-slate-50/30 gap-6">
              <button
                onClick={() => setActiveModalTab('register')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeModalTab === 'register'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <PlusCircle size={16} /> Register Company
              </button>
              <button
                onClick={() => setActiveModalTab('list')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeModalTab === 'list'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Building size={16} /> Registered ({employers.length})
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeModalTab === 'register' ? (
                <form onSubmit={handleCreateCompany} className="space-y-4">
                  {/* Field 1: Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tata Consultancy Services"
                        value={companyForm.companyName}
                        onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                        className="pl-9 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 2: HR Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      HR Representative Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Sharma"
                        value={companyForm.hrName}
                        onChange={(e) => setCompanyForm({ ...companyForm, hrName: e.target.value })}
                        className="pl-9 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 3: Login Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Login Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                      <input
                        type="email"
                        required
                        placeholder="e.g. hr@tcs.com"
                        value={companyForm.email}
                        onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                        className="pl-9 w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Default Password Notice */}
                  <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-800">
                    <span>Default Password: <strong>Company@123</strong></span>
                    <span className="text-indigo-500">Auto-filled</span>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsCompanyModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingCompany}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      {creatingCompany ? 'Saving to Database...' : 'Register Company'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {employers.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      No companies registered in database yet.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase">
                            <th className="py-2.5">Company Name</th>
                            <th className="py-2.5">HR Name</th>
                            <th className="py-2.5">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {employers.map(emp => (
                            <tr key={emp._id} className="hover:bg-slate-50/50">
                              <td className="py-3 font-semibold text-slate-900">
                                {emp.companyName || (emp.firstName ? `${emp.firstName} ${emp.lastName || ''}`.trim() : 'Registered Company')}
                              </td>
                              <td className="py-3 text-slate-600">{emp.firstName} {emp.lastName || ''}</td>
                              <td className="py-3 text-slate-500 font-mono text-xs">{emp.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Industrial Training Submissions Modal */}
      {isIndustrialModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <GraduationCap className="text-amber-300" size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">CA Industrial Training Form Applications</h2>
                  <p className="text-xs text-blue-100 font-medium">
                    {industrialList.length} verified candidate registrations recorded
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportIndustrialExcel}
                  className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  title="Download the exact Excel spreadsheet"
                >
                  <FileSpreadsheet size={14} /> Download Excel
                </button>
                <button
                  onClick={() => setIsIndustrialModalOpen(false)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Filter by candidate name, email, firm, or city..."
                  value={industrialSearch}
                  onChange={(e) => setIndustrialSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Showing {industrialList.filter(app => {
                  if (!industrialSearch) return true;
                  const q = industrialSearch.toLowerCase();
                  return (
                    (app.name || '').toLowerCase().includes(q) ||
                    (app.email || '').toLowerCase().includes(q) ||
                    (app.articleshipFirmName || '').toLowerCase().includes(q) ||
                    (app.currentLocation || '').toLowerCase().includes(q)
                  );
                }).length} applications
              </span>
            </div>

            {/* Table */}
            <div className="overflow-y-auto overflow-x-auto flex-1 p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                    <th className="px-3 py-2.5">Candidate</th>
                    <th className="px-3 py-2.5">Contact</th>
                    <th className="px-3 py-2.5">Location</th>
                    <th className="px-3 py-2.5">CA Inter Batch</th>
                    <th className="px-3 py-2.5">1st Attempt</th>
                    <th className="px-3 py-2.5">Articleship Firm</th>
                    <th className="px-3 py-2.5">Start Date</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingIndustrial ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        Loading Industrial Training applications...
                      </td>
                    </tr>
                  ) : industrialList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No Industrial Training applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    industrialList
                      .filter(app => {
                        if (!industrialSearch) return true;
                        const q = industrialSearch.toLowerCase();
                        return (
                          (app.name || '').toLowerCase().includes(q) ||
                          (app.email || '').toLowerCase().includes(q) ||
                          (app.articleshipFirmName || '').toLowerCase().includes(q) ||
                          (app.currentLocation || '').toLowerCase().includes(q)
                        );
                      })
                      .map((app) => (
                        <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-3">
                            <p className="font-bold text-slate-900">{app.name}</p>
                            <span className="text-[10px] text-slate-500">{app.gender} • {app.dob}</span>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-slate-800 font-mono">{app.phone}</p>
                            <p className="text-slate-500 text-[11px] truncate">{app.email}</p>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-slate-800">{app.currentLocation}</p>
                            <span className="text-[10px] text-slate-500">{app.currentState}</span>
                          </td>
                          <td className="px-3 py-3 font-semibold text-blue-700">
                            {app.caInterBatch}
                            {app.caInterRank && app.caInterRank !== 'No Rank' && (
                              <span className="block text-[10px] text-amber-600 font-bold">{app.caInterRank}</span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.bothGroups1stAttempt === 'Yes' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {app.bothGroups1stAttempt}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-semibold text-slate-800">
                            {app.articleshipFirmName}
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            {app.articleshipStartMonthYear}
                          </td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              ✓ {app.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Tip: Click &quot;Download Excel&quot; to export the full spreadsheet matching your recruitment sheet format.
              </span>
              <button
                onClick={() => setIsIndustrialModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </AdminLayout>
  );
};
