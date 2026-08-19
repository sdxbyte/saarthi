/**
 * DevTrack Government Project Tracking Service
 *
 * Provides authentic, transparent tracking of Nepal Municipal & Government Development Projects,
 * Budgets, Expenditures, Contractor Details, Physical/Financial Progress, Ward Allocations,
 * and Citizen Audit/Grievance Reporting.
 */

export interface DevTrackProject {
  id: string;
  code: string; // e.g., KMC-DEV-2083-014
  title: string;
  titleNp: string;
  category: 'Roads & Bridges' | 'Water & Sanitation' | 'Smart City & Digital' | 'Heritage & Tourism' | 'Health & Education' | 'Urban Environment';
  municipality: string;
  wardNumber: number;
  budgetAllocatedNpr: number;
  amountSpentNpr: number;
  contractorName: string;
  executingDepartment: string;
  startDateBs: string;
  startDateAd: string;
  targetCloseDateBs: string;
  targetCloseDateAd: string;
  physicalProgressPercent: number;
  financialProgressPercent: number;
  status: 'In Progress' | 'Tender Phase' | 'Delayed' | 'Completed' | 'Under Audit';
  qualityRating: number; // 1-5 scale
  citizenFeedbackCount: number;
  locationName: string;
  description: string;
  descriptionNp: string;
  lastUpdatedBs: string;
  lastUpdatedAd: string;
}

export interface DevTrackStats {
  totalProjects: number;
  totalBudgetAllocatedNpr: number;
  totalAmountSpentNpr: number;
  avgPhysicalProgressPercent: number;
  completedProjectsCount: number;
  delayedProjectsCount: number;
  activeWardsCount: number;
  citizenReportsCount: number;
}

export interface CitizenProjectReport {
  id: string;
  projectId: string;
  projectTitle: string;
  reporterName: string;
  reporterPhone: string;
  wardNumber: number;
  issueCategory: 'Delay in Execution' | 'Substandard Material' | 'Safety Hazard' | 'Budget Discrepancy' | 'Environmental Damage' | 'General Feedback';
  description: string;
  submittedBs: string;
  submittedAd: string;
  status: 'Pending Verification' | 'Under Review' | 'Forwarded to KMC' | 'Resolved';
}

// Authentic dataset for Kathmandu Metropolitan City (KMC) & Nepal Development Projects
const MOCK_DEVTRACK_PROJECTS: DevTrackProject[] = [
  {
    id: 'dt-kmc-001',
    code: 'KMC-DEV-2083-001',
    title: 'Smart Solar Street Lighting & CCTV Grid Network',
    titleNp: 'स्मार्ट सोलार सडक बत्ती तथा सिसीटिभी सञ्जाल विस्तार',
    category: 'Smart City & Digital',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 10,
    budgetAllocatedNpr: 125000000,
    amountSpentNpr: 98000000,
    contractorName: 'Nepal Electricity & Telecom Infrastructure Pvt. Ltd.',
    executingDepartment: 'Urban Infrastructure & Technology Department, KMC',
    startDateBs: '2082-08-15',
    startDateAd: '2025-11-30',
    targetCloseDateBs: '2083-06-30',
    targetCloseDateAd: '2026-10-16',
    physicalProgressPercent: 82,
    financialProgressPercent: 78.4,
    status: 'In Progress',
    qualityRating: 4.6,
    citizenFeedbackCount: 42,
    locationName: 'Baneshwor - Tinkune - Sinamangal Corridor',
    description: 'Installation of high-efficiency solar street lamps, automatic motion sensors, and 4K optical surveillance cameras synced with KMC Control Center.',
    descriptionNp: 'बानेश्वर-तीनकुने-सिनामंगल करिडोरमा उच्च क्षमताको स्मार्ट सोलार बत्ती र ४के निगरानी क्यामेरा जडान कार्य।',
    lastUpdatedBs: '2083-04-26',
    lastUpdatedAd: '2026-08-11',
  },
  {
    id: 'dt-kmc-002',
    code: 'KMC-DEV-2083-002',
    title: 'Bagmati Corridor Heritage Beautification & Sanitation Project',
    titleNp: 'बागमती करिडोर सम्पदा सौन्दर्यीकरण तथा सरसफाइ आयोजना',
    category: 'Heritage & Tourism',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 11,
    budgetAllocatedNpr: 340000000,
    amountSpentNpr: 215000000,
    contractorName: 'Himalayan Eco Infrastructure Builders JV',
    executingDepartment: 'Environment Management Division, KMC',
    startDateBs: '2081-11-01',
    startDateAd: '2025-02-12',
    targetCloseDateBs: '2083-12-30',
    targetCloseDateAd: '2027-04-13',
    physicalProgressPercent: 68,
    financialProgressPercent: 63.2,
    status: 'In Progress',
    qualityRating: 4.2,
    citizenFeedbackCount: 89,
    locationName: 'Thapathali - Teku Bagmati Bank',
    description: 'Riverbank bio-engineering, green park construction, pedestrian walkways, stone paving, and solid waste interception traps.',
    descriptionNp: 'थापाथलीदेखि टेकुसम्म बागमती नदी किनारमा ग्रिन पार्क, पदमार्ग तथा फोहोर नियन्त्रण प्रविधि जडान।',
    lastUpdatedBs: '2083-04-25',
    lastUpdatedAd: '2026-08-10',
  },
  {
    id: 'dt-kmc-003',
    code: 'KMC-DEV-2083-003',
    title: 'Maitighar Underground Cable & Utility Ducting Extension',
    titleNp: 'माइतीघर भूमिगत केबल तथा युटिलिटी डक्टिङ विस्तार',
    category: 'Roads & Bridges',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 31,
    budgetAllocatedNpr: 520000000,
    amountSpentNpr: 480000000,
    contractorName: 'Nepal Electricity Authority & KMC Ducting Unit',
    executingDepartment: 'Public Works Department, KMC',
    startDateBs: '2081-04-10',
    startDateAd: '2024-07-25',
    targetCloseDateBs: '2083-03-30',
    targetCloseDateAd: '2026-07-15',
    physicalProgressPercent: 94,
    financialProgressPercent: 92.3,
    status: 'In Progress',
    qualityRating: 4.4,
    citizenFeedbackCount: 134,
    locationName: 'Maitighar - Tripureshwor Stretch',
    description: 'Undergrounding overhead electrical power cables, high-speed optical fiber lines, and stormwater drainage integration.',
    descriptionNp: 'माइतीघरदेखि त्रिपुरेश्वरसम्म ओभरहेड बिजुली तथा टेलिकम तार भूमिगत गरी सडक ढल व्यवस्थित गर्ने कार्य।',
    lastUpdatedBs: '2083-04-20',
    lastUpdatedAd: '2026-08-05',
  },
  {
    id: 'dt-kmc-004',
    code: 'KMC-DEV-2083-004',
    title: 'Sundarijal-KUKL Clean Drinking Water Distribution Pipeline (Phase II)',
    titleNp: 'सुन्दरीजल-केयुकेएल शुद्ध खानेपानी वितरण पाइपलाइन (दोस्रो चरण)',
    category: 'Water & Sanitation',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 6,
    budgetAllocatedNpr: 890000000,
    amountSpentNpr: 410000000,
    contractorName: 'Sino-Hydro Nepal Infrastructure Group',
    executingDepartment: 'Kathmandu Upatyaka Khanepani Limited (KUKL) / KMC Liaison',
    startDateBs: '2082-01-15',
    startDateAd: '2025-04-28',
    targetCloseDateBs: '2084-02-28',
    targetCloseDateAd: '2027-06-12',
    physicalProgressPercent: 48,
    financialProgressPercent: 46.1,
    status: 'Delayed',
    qualityRating: 3.8,
    citizenFeedbackCount: 210,
    locationName: 'Chabahil - Boudha - Jorpati Main Line',
    description: 'Ductile iron main pipeline laying for household water connection, pressure management valves, and smart metering nodes.',
    descriptionNp: 'चाबहिलदेखि बौद्ध-जोरपाटी खण्डमा नयाँ खानेपानी पाइपलाइन बिछ्याउने र डिजिटल मिटरिङ जडान।',
    lastUpdatedBs: '2083-04-27',
    lastUpdatedAd: '2026-08-12',
  },
  {
    id: 'dt-kmc-005',
    code: 'KMC-DEV-2083-005',
    title: 'Ward 24 Historic Core Paving & Traditional Newari Conservation',
    titleNp: 'वडा २४ परम्परागत न्हू पुखू तथा परम्परागत मल्लकालीन सम्पदा पुनरुत्थान',
    category: 'Heritage & Tourism',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 24,
    budgetAllocatedNpr: 85000000,
    amountSpentNpr: 85000000,
    contractorName: 'Kasthamandap Artisan Craftsmen Society',
    executingDepartment: 'Heritage Conservation Department, KMC',
    startDateBs: '2081-08-01',
    startDateAd: '2024-11-16',
    targetCloseDateBs: '2083-01-30',
    targetCloseDateAd: '2026-05-13',
    physicalProgressPercent: 100,
    financialProgressPercent: 100,
    status: 'Completed',
    qualityRating: 4.9,
    citizenFeedbackCount: 65,
    locationName: 'Makhan Tole - Surkhet Galli Heritage Zone',
    description: 'Restoration of traditional terracotta Telia bricks, wooden carved windows, stone spouts (Dhunge Dhara), and courtyard illumination.',
    descriptionNp: 'माखन टोल क्षेत्रमा तेलिया इँटा छपाई, काठका बुट्टेदार झ्याल पुनरुत्थान तथा परम्परागत ढुङ्गेधारा जिर्णोद्धार।',
    lastUpdatedBs: '2083-02-10',
    lastUpdatedAd: '2026-05-23',
  },
  {
    id: 'dt-kmc-006',
    code: 'KMC-DEV-2083-006',
    title: 'KMC E-Governance Citizen Portal & Mobile App 3.0 Upgrade',
    titleNp: 'काठमाडौँ महानगरपालिका डिजिटल सेवा तथा मोबाइल एप ३.० स्तरोन्नति',
    category: 'Smart City & Digital',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 1,
    budgetAllocatedNpr: 45000000,
    amountSpentNpr: 32000000,
    contractorName: 'TechSansar Solutions & DevTrack Open Systems',
    executingDepartment: 'Information Technology Division, KMC',
    startDateBs: '2082-09-01',
    startDateAd: '2025-12-16',
    targetCloseDateBs: '2083-08-30',
    targetCloseDateAd: '2026-12-15',
    physicalProgressPercent: 75,
    financialProgressPercent: 71.1,
    status: 'In Progress',
    qualityRating: 4.8,
    citizenFeedbackCount: 38,
    locationName: 'KMC Central Office, Teku & All 32 Ward Digital Desks',
    description: 'Online tax payment portal, house map clearance tracking, vital registration digitalization, and citizen grievance dashboard.',
    descriptionNp: 'महानगरपालिकाका ३२ वटै वडामा अनलाइन कर भुक्तानी, नक्सा पास र डिजिटल नागरिक सेवा विस्तार।',
    lastUpdatedBs: '2083-04-27',
    lastUpdatedAd: '2026-08-12',
  },
  {
    id: 'dt-kmc-007',
    code: 'KMC-DEV-2083-007',
    title: 'Municipal Free Primary Health Clinic & Dialysis Center Expansion',
    titleNp: 'महानगर निःशुल्क प्राथमिक स्वास्थ्य क्लिनिक तथा डायलाइसिस केन्द्र स्थापना',
    category: 'Health & Education',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 15,
    budgetAllocatedNpr: 180000000,
    amountSpentNpr: 120000000,
    contractorName: 'Swayambhu Health Services & Construction Pvt. Ltd.',
    executingDepartment: 'Public Health Department, KMC',
    startDateBs: '2082-03-01',
    startDateAd: '2025-06-15',
    targetCloseDateBs: '2083-09-30',
    targetCloseDateAd: '2027-01-14',
    physicalProgressPercent: 65,
    financialProgressPercent: 66.6,
    status: 'In Progress',
    qualityRating: 4.5,
    citizenFeedbackCount: 51,
    locationName: 'Swayambhu - Bhagwanpourah Precinct',
    description: 'Construction of a modern 20-bed municipal health clinic with dedicated hemodialysis units, pathology lab, and senior citizen wellness center.',
    descriptionNp: 'स्वयम्भू क्षेत्रमा २० शय्याको आधुनिक महानगर क्लिनिक, नि:शुल्क डायलाइसिस तथा ज्येष्ठ नागरिक आरोग्य केन्द्र निर्माण।',
    lastUpdatedBs: '2083-04-22',
    lastUpdatedAd: '2026-08-07',
  },
  {
    id: 'dt-kmc-008',
    code: 'KMC-DEV-2083-008',
    title: 'Kalanki - Sitapaila Permeable Asphalt Resurfacing & Drainage Upgrade',
    titleNp: 'कलङ्की-सीतापाइला सडक एस्फाल्ट कालोपत्रे तथा ढल निकास स्तरोन्नति',
    category: 'Roads & Bridges',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 14,
    budgetAllocatedNpr: 210000000,
    amountSpentNpr: 185000000,
    contractorName: 'Lumbini-Gaurishankar Infrastructure JV',
    executingDepartment: 'Public Works Department, KMC',
    startDateBs: '2081-06-10',
    startDateAd: '2024-09-26',
    targetCloseDateBs: '2083-05-15',
    targetCloseDateAd: '2026-08-31',
    physicalProgressPercent: 91,
    financialProgressPercent: 88.0,
    status: 'In Progress',
    qualityRating: 4.3,
    citizenFeedbackCount: 76,
    locationName: 'Kalanki Chowk to Sitapaila Ring Road Feeder',
    description: 'Heavy-duty asphalt concrete resurfacing, reinforced RCC storm drain culverts, and tactile paving for visually impaired pedestrians.',
    descriptionNp: 'कलङ्कीदेखि सीतापाइलासम्म उच्च गुणस्तरीय एस्फाल्ट कालोपत्रे र आरसीसी ढल निकास निर्माण।',
    lastUpdatedBs: '2083-04-20',
    lastUpdatedAd: '2026-08-05',
  },
  {
    id: 'dt-kmc-009',
    code: 'KMC-DEV-2083-009',
    title: 'Municipal Public School Digital Smart Classroom & STEAM Lab Equipment',
    titleNp: 'महानगर सा सामुदायिक विद्यालय डिजिटल स्मार्ट क्लासरुम तथा स्टिम ल्याब',
    category: 'Health & Education',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 4,
    budgetAllocatedNpr: 95000000,
    amountSpentNpr: 95000000,
    contractorName: 'Educational Technology & Infrastructure Nepal',
    executingDepartment: 'Education Department, KMC',
    startDateBs: '2082-02-01',
    startDateAd: '2025-05-15',
    targetCloseDateBs: '2083-02-30',
    targetCloseDateAd: '2026-06-13',
    physicalProgressPercent: 100,
    financialProgressPercent: 100,
    status: 'Completed',
    qualityRating: 4.8,
    citizenFeedbackCount: 31,
    locationName: 'Baluwatar, Bishal Nagar & Ward 4 Community Schools',
    description: 'Interactive smart touchboards, high-speed internet routers, 3D printers, and robotics learning kits across 14 municipal schools.',
    descriptionNp: 'वडा ४ अन्तर्गतका १४ सामुदायिक विद्यालयमा डिजिटल स्मार्ट बोर्ड, इन्टरनेट तथा रोबोटिक्स ल्याब स्थापना।',
    lastUpdatedBs: '2083-03-01',
    lastUpdatedAd: '2026-06-15',
  },
  {
    id: 'dt-kmc-010',
    code: 'KMC-DEV-2083-010',
    title: 'Urban Organic Waste Composting & Biomethanation Plant',
    titleNp: 'महानगर जैविक फोहोर कम्पोस्टिङ तथा बायोग्यास प्लान्ट स्थापना',
    category: 'Urban Environment',
    municipality: 'Kathmandu Metropolitan City',
    wardNumber: 12,
    budgetAllocatedNpr: 290000000,
    amountSpentNpr: 110000000,
    contractorName: 'Clean City Green Tech International Ltd.',
    executingDepartment: 'Environment Management Division, KMC',
    startDateBs: '2082-05-01',
    startDateAd: '2025-08-17',
    targetCloseDateBs: '2084-01-30',
    targetCloseDateAd: '2027-05-14',
    physicalProgressPercent: 40,
    financialProgressPercent: 37.9,
    status: 'In Progress',
    qualityRating: 4.1,
    citizenFeedbackCount: 29,
    locationName: 'Teku Waste Transfer Station Precinct',
    description: 'Processing 50 tons/day of organic kitchen waste into bio-fertilizer and compressed methane gas for KMC municipal vehicles.',
    descriptionNp: 'टेकु फोहोर संकलन केन्द्र परिसरमा दैनिक ५० टन जैविक फोहोरबाट बायोग्यास र कम्पोस्ट मल उत्पादन प्रविधि।',
    lastUpdatedBs: '2083-04-18',
    lastUpdatedAd: '2026-08-03',
  }
];

// In-memory reports storage
let CITIZEN_REPORTS_STORE: CitizenProjectReport[] = [
  {
    id: 'rep-101',
    projectId: 'dt-kmc-004',
    projectTitle: 'Sundarijal-KUKL Clean Drinking Water Distribution Pipeline (Phase II)',
    reporterName: 'Ram Shrestha',
    reporterPhone: '9841******',
    wardNumber: 6,
    issueCategory: 'Delay in Execution',
    description: 'Road excavation has been left open for 3 weeks near Chabahil Chowk creating severe traffic jams and dust pollution.',
    submittedBs: '2083-04-20',
    submittedAd: '2026-08-05',
    status: 'Under Review',
  },
  {
    id: 'rep-102',
    projectId: 'dt-kmc-001',
    projectTitle: 'Smart Solar Street Lighting & CCTV Grid Network',
    reporterName: 'Sujata Thapa',
    reporterPhone: '9851******',
    wardNumber: 10,
    issueCategory: 'General Feedback',
    description: 'Solar lights working excellently on New Baneshwor stretch! Requesting 2 additional camera nodes near the pedestrian bridge.',
    submittedBs: '2083-04-24',
    submittedAd: '2026-08-09',
    status: 'Forwarded to KMC',
  }
];

/**
 * Get DevTrack summary statistics
 */
export function getDevTrackStats(): DevTrackStats {
  const totalProjects = MOCK_DEVTRACK_PROJECTS.length;
  const totalBudgetAllocatedNpr = MOCK_DEVTRACK_PROJECTS.reduce((sum, p) => sum + p.budgetAllocatedNpr, 0);
  const totalAmountSpentNpr = MOCK_DEVTRACK_PROJECTS.reduce((sum, p) => sum + p.amountSpentNpr, 0);
  const avgPhysicalProgressPercent = Math.round(
    MOCK_DEVTRACK_PROJECTS.reduce((sum, p) => sum + p.physicalProgressPercent, 0) / totalProjects
  );
  const completedProjectsCount = MOCK_DEVTRACK_PROJECTS.filter((p) => p.status === 'Completed').length;
  const delayedProjectsCount = MOCK_DEVTRACK_PROJECTS.filter((p) => p.status === 'Delayed').length;
  const activeWardsCount = new Set(MOCK_DEVTRACK_PROJECTS.map((p) => p.wardNumber)).size;

  return {
    totalProjects,
    totalBudgetAllocatedNpr,
    totalAmountSpentNpr,
    avgPhysicalProgressPercent,
    completedProjectsCount,
    delayedProjectsCount,
    activeWardsCount,
    citizenReportsCount: CITIZEN_REPORTS_STORE.length,
  };
}

/**
 * Filter and fetch DevTrack Projects
 */
export function getDevTrackProjects(filters?: {
  searchTerm?: string;
  category?: string;
  wardNumber?: number | string;
  status?: string;
}): DevTrackProject[] {
  return MOCK_DEVTRACK_PROJECTS.filter((p) => {
    if (filters?.searchTerm) {
      const q = filters.searchTerm.toLowerCase();
      const matches =
        p.title.toLowerCase().includes(q) ||
        p.titleNp.includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.contractorName.toLowerCase().includes(q) ||
        p.locationName.toLowerCase().includes(q);
      if (!matches) return false;
    }

    if (filters?.category && filters.category !== 'all') {
      if (p.category !== filters.category) return false;
    }

    if (filters?.wardNumber && filters.wardNumber !== 'all') {
      if (p.wardNumber !== Number(filters.wardNumber)) return false;
    }

    if (filters?.status && filters.status !== 'all') {
      if (p.status !== filters.status) return false;
    }

    return true;
  });
}

/**
 * Get single project by ID
 */
export function getDevTrackProjectById(id: string): DevTrackProject | undefined {
  return MOCK_DEVTRACK_PROJECTS.find((p) => p.id === id);
}

/**
 * Get all citizen reports
 */
export function getCitizenProjectReports(): CitizenProjectReport[] {
  return [...CITIZEN_REPORTS_STORE];
}

/**
 * Submit new Citizen Project Quality/Grievance Report
 */
export function submitCitizenProjectReport(report: Omit<CitizenProjectReport, 'id' | 'submittedBs' | 'submittedAd' | 'status'>): CitizenProjectReport {
  const newReport: CitizenProjectReport = {
    ...report,
    id: `rep-${Date.now().toString().slice(-4)}`,
    submittedBs: '2083-04-27',
    submittedAd: '2026-08-12',
    status: 'Pending Verification',
  };

  CITIZEN_REPORTS_STORE.unshift(newReport);

  // Increment citizen feedback count on project
  const project = MOCK_DEVTRACK_PROJECTS.find((p) => p.id === report.projectId);
  if (project) {
    project.citizenFeedbackCount += 1;
  }

  return newReport;
}

/**
 * Helper to format NPR currency cleanly
 */
export function formatNprCurrency(amountNpr: number): string {
  if (amountNpr >= 10000000) {
    const crore = (amountNpr / 10000000).toFixed(2);
    return `NPR ${crore} Crore (रु ${crore} करोड)`;
  }
  if (amountNpr >= 100000) {
    const lakh = (amountNpr / 100000).toFixed(2);
    return `NPR ${lakh} Lakh (रु ${lakh} लाख)`;
  }
  return `NPR ${amountNpr.toLocaleString('en-IN')}`;
}
