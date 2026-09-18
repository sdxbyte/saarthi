export type AdminRole = 'Super Admin' | 'SUPER_ADMIN' | 'Admin' | 'Moderator' | 'Support' | 'Citizen';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department: string;
  avatar?: string;
  lastLogin: string;
  status: 'Active' | 'Suspended' | 'Pending Approval';
  permissions: string[];
}

export interface VerificationDocument {
  id: string;
  citizenName: string;
  citizenNID: string;
  documentType: 'Bluebook Renewal' | 'Driving License' | 'Citizenship Card' | 'Passport Application' | 'Tax Exemption';
  submittedDate: string;
  province: string;
  status: 'Pending' | 'Verified' | 'Rejected' | 'In Review';
  assignedTo?: string;
  notes?: string;
  documentUrl?: string;
}

export interface CivicServiceControl {
  id: string;
  serviceName: string;
  category: string;
  isActive: boolean;
  processingDays: number;
  feeAmountNPR: number;
  totalApplicationsToday: number;
  uptimePercentage: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SECURITY';
  module: string;
  action: string;
  performedBy: string;
  ipAddress: string;
}

export interface CivicComplaint {
  id: string;
  ticketNo: string;
  citizenName: string;
  subject: string;
  category: 'Road & Transport' | 'Tax Discrepancy' | 'Public Utility' | 'Document Delay' | 'Corruption Grievance';
  municipality: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  dateFiled: string;
  assignedOfficer?: string;
}

export interface SystemMetrics {
  serverStatus: 'Optimal' | 'Degraded' | 'Maintenance';
  cpuLoad: number;
  memoryUsage: number;
  activeUsersOnline: number;
  apiRequestsToday: number;
  dailyTransactionsNPR: number;
  pendingVerifications: number;
}
