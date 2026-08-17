import type { ScreenPopData } from '@/types/contact';

/** Sample contacts for demo mode. Shaped exactly like what the contact-flow
 *  attributes produce in live mode so the UI code path is identical. */
export const SAMPLE_CONTACTS: ScreenPopData[] = [
  {
    contactId: 'ctx-7f2a91b4',
    phone: '+1 (843) 555-0164',
    queue: 'VA CCN claims',
    channel: 'Voice',
    ivrPath: 'Claims > Status inquiry',
    attributes: {
      callReason: 'Claim status',
      claimRef: 'CLM-2026-044812',
      language: 'English',
      authenticated: 'Yes',
    },
    customer: {
      name: 'Robert Delgado',
      memberId: 'VET-1104829',
      program: 'VA CCN Region 3',
      tier: 'Priority group 1',
      location: 'Charleston, SC',
    },
    history: [
      { id: 'h1', channel: 'voice', summary: 'Called about claim CLM-2026-044812', date: 'Aug 4', outcome: 'escalated' },
      { id: 'h2', channel: 'chat', summary: 'Chat — appointment reschedule', date: 'Jul 22', outcome: 'resolved' },
      { id: 'h3', channel: 'voice', summary: 'Missed callback attempt', date: 'Jul 18', outcome: 'missed' },
    ],
  },
  {
    contactId: 'ctx-3c8de017',
    phone: '+1 (614) 555-0233',
    queue: 'Exam scheduling',
    channel: 'Voice',
    ivrPath: 'Exams > Reschedule',
    attributes: {
      callReason: 'Reschedule C&P exam',
      examRef: 'EX-88231',
      language: 'English',
      authenticated: 'Yes',
      priority: 'High',
    },
    customer: {
      name: 'Angela Whitfield',
      memberId: 'VET-0938271',
      program: 'LHI disability exams',
      tier: 'Standard',
      location: 'Columbus, OH',
    },
    history: [
      { id: 'h1', channel: 'voice', summary: 'Scheduled exam EX-88231', date: 'Jul 30', outcome: 'resolved' },
    ],
  },
  {
    contactId: 'ctx-b91f4e62',
    phone: '+1 (800) 555-0101',
    queue: 'Provider services',
    channel: 'Voice',
    ivrPath: 'Providers > Credentialing',
    attributes: {
      callReason: 'Credentialing status',
      npi: '1234567890',
      language: 'English',
      authenticated: 'No',
    },
    customer: {
      name: 'Unknown caller',
      memberId: '—',
      program: 'Provider network',
      tier: '—',
      location: '—',
    },
    history: [],
  },
  {
    contactId: 'ctx-5d20aa38',
    phone: '+1 (912) 555-0177',
    queue: 'VA CCN claims',
    channel: 'Voice',
    ivrPath: 'Claims > Denied claim',
    attributes: {
      callReason: 'Denied claim question',
      claimRef: 'CLM-2025-098812',
      language: 'English',
      authenticated: 'Yes',
    },
    customer: {
      name: 'Marcus Okafor',
      memberId: 'VET-2207713',
      program: 'VA CCN Region 3',
      tier: 'Standard',
      location: 'Savannah, GA',
    },
    history: [
      { id: 'h1', channel: 'voice', summary: 'Called about denied stress test claim', date: 'Jul 8', outcome: 'escalated' },
    ],
  },
];

export function randomSampleContact(): ScreenPopData {
  const base = SAMPLE_CONTACTS[Math.floor(Math.random() * SAMPLE_CONTACTS.length)];
  // Fresh contact id per pop so logs are distinguishable
  return { ...base, contactId: `ctx-${Math.random().toString(16).slice(2, 10)}` };
}
