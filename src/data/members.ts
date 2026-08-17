import type { LookupResult, MemberRecord } from '@/types/member';

/** Sample dataset standing in for an eligibility/claims API. In production,
 *  replace lookupMember() with a fetch to your backend using the memberId
 *  from the call metadata. */
const MEMBERS: MemberRecord[] = [
  {
    memberId: '1104829',
    name: 'Robert',
    dateOfBirth: '1968-03-14',
    program: 'VA CCN Region 3',
    plan: {
      name: 'Community Care Network — Standard',
      groupNumber: 'CCN3-04421',
      effectiveDate: '2024-01-01',
      status: 'active',
      network: 'CCN Region 3',
      pcp: 'Dr. Alicia Monroe, Charleston VA Clinic',
    },
    accumulators: {
      deductible: { met: 350, limit: 500 },
      outOfPocket: { met: 1240, limit: 3000 },
    },
    eligibility: {
      medical: true,
      behavioralHealth: true,
      pharmacy: true,
      dental: false,
      vision: true,
    },
    claims: [
      { id: 'CLM-2026-044812', serviceDate: '2026-07-18', provider: 'Lowcountry Orthopedics', service: 'MRI, lumbar spine', billed: 2140, planPaid: 1712, memberOwes: 428, status: 'processing' },
      { id: 'CLM-2026-041207', serviceDate: '2026-06-02', provider: 'Charleston Imaging', service: 'X-ray, knee', billed: 310, planPaid: 279, memberOwes: 31, status: 'paid' },
      { id: 'CLM-2026-038554', serviceDate: '2026-05-11', provider: 'Dr. A. Monroe', service: 'Office visit, established', billed: 185, planPaid: 166, memberOwes: 19, status: 'paid' },
      { id: 'CLM-2026-031990', serviceDate: '2026-03-27', provider: 'Palmetto PT Group', service: 'Physical therapy (6 visits)', billed: 720, planPaid: 0, memberOwes: 720, status: 'appealed' },
    ],
    priorAuths: [
      { id: 'PA-88410', service: 'MRI, lumbar spine', requestedBy: 'Lowcountry Orthopedics', submitted: '2026-07-10', status: 'approved', expires: '2026-10-10' },
      { id: 'PA-89122', service: 'Epidural steroid injection', requestedBy: 'Lowcountry Orthopedics', submitted: '2026-08-01', status: 'pending' },
    ],
    flags: ['Appeal in progress on CLM-2026-031990'],
  },
  {
    memberId: '12345',
    name: 'Peter',
    dateOfBirth: '1981-11-02',
    program: 'LHI disability exams',
    plan: {
      name: 'C&P Examination Program',
      groupNumber: 'LHI-EX-2210',
      effectiveDate: '2026-05-15',
      status: 'active',
      network: 'LHI national provider network',
      pcp: '—',
    },
    accumulators: {
      deductible: { met: 0, limit: 0 },
      outOfPocket: { met: 0, limit: 0 },
    },
    eligibility: {
      medical: true,
      behavioralHealth: true,
      pharmacy: false,
      dental: false,
      vision: false,
    },
    claims: [
      { id: 'CLM-2026-040118', serviceDate: '2026-06-20', provider: 'LHI Exam Center, Columbus', service: 'General medical C&P exam', billed: 0, planPaid: 0, memberOwes: 0, status: 'paid' },
    ],
    priorAuths: [
      { id: 'PA-90031', service: 'Audiology C&P exam', requestedBy: 'VBA Regional Office', submitted: '2026-07-28', status: 'approved', expires: '2026-09-28' },
    ],
    flags: ['Exam EX-88231 scheduled 2026-08-19 09:30 — Columbus, OH'],
  },
  {
    memberId: '9876',
    name: 'Jonathan',
    dateOfBirth: '1990-07-22',
    program: 'VA CCN Region 3',
    plan: {
      name: 'Community Care Network — Standard',
      groupNumber: 'CCN3-04421',
      effectiveDate: '2023-06-01',
      status: 'termed',
      network: 'CCN Region 3',
      pcp: 'Dr. James Park, Savannah VA Clinic',
    },
    accumulators: {
      deductible: { met: 500, limit: 500 },
      outOfPocket: { met: 2980, limit: 3000 },
    },
    eligibility: {
      medical: false,
      behavioralHealth: false,
      pharmacy: false,
      dental: false,
      vision: false,
    },
    claims: [
      { id: 'CLM-2026-029441', serviceDate: '2026-02-14', provider: 'Savannah Cardiology', service: 'Echocardiogram', billed: 980, planPaid: 882, memberOwes: 98, status: 'paid' },
      { id: 'CLM-2026-027102', serviceDate: '2026-01-30', provider: 'Coastal Labs', service: 'Lipid panel', billed: 95, planPaid: 95, memberOwes: 0, status: 'paid' },
      { id: 'CLM-2025-098812', serviceDate: '2025-12-08', provider: 'Savannah Cardiology', service: 'Stress test', billed: 1420, planPaid: 0, memberOwes: 1420, status: 'denied' },
    ],
    priorAuths: [],
    flags: ['Coverage termed 2026-06-30 — verify current eligibility before quoting benefits'],
  },
];

const index = new Map(MEMBERS.map((m) => [m.memberId.toUpperCase(), m]));

export function lookupMember(memberId: string | null): LookupResult {
  if (!memberId || memberId.trim() === '') return { kind: 'no-query' };
  const record = index.get(memberId.trim().toUpperCase());
  return record ? { kind: 'found', record } : { kind: 'not-found', memberId: memberId.trim() };
}

export const SAMPLE_MEMBER_IDS = MEMBERS.map((m) => ({ memberId: m.memberId, name: m.name }));
