export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'CITIZEN' | 'ADMIN' | 'DEVELOPER' | 'OFFICIAL';
  isVerified: boolean;
  provinceId?: number;
  district?: string;
  municipality?: string;
  wardNumber?: number;
  citizenshipNumber?: string;
  createdAt: string;
}

export interface CivicRequestRecord {
  id: string;
  trackingId: string;
  userId: string;
  category: 'ROADS' | 'WATER' | 'ELECTRICITY' | 'TAX_INQUIRY' | 'MALPOT' | 'OTHER';
  title: string;
  description: string;
  locationAddress?: string;
  province?: string;
  district?: string;
  wardNo?: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedDepartment?: string;
  upvotes: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface TaxRecord {
  id: string;
  userId: string;
  taxType: 'INCOME_TAX' | 'BLUEBOOK_VEHICLE' | 'PROPERTY_MALPOT' | 'BUSINESS';
  fiscalYear: string;
  calculatedAmount: number;
  paidAmount: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'EXEMPT';
  vehicleEngineCc?: number;
  vehicleType?: string;
  createdAt: string;
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  category: 'NEPSE' | 'LOK_SEWA' | 'TAX_NOTICE' | 'GOVT_CIRCULAR' | 'EMERGENCY';
  body: string;
  officialLink?: string;
  isFeatured: boolean;
  publishedBy: string;
  createdAt: string;
}

export interface AiConversationRecord {
  id: string;
  userId?: string;
  sessionId: string;
  userQuery: string;
  aiResponse: string;
  language: string;
  groundingSources?: Array<{ title: string; uri: string }>;
  receiptScanData?: Record<string, any>;
  createdAt: string;
}

export interface DatabaseDump {
  version: string;
  exportedAt: string;
  tables: {
    usersCount: number;
    civicRequestsCount: number;
    taxRecordsCount: number;
    announcementsCount: number;
    auditLogsCount: number;
  };
  seedStatus: string;
}
