export interface Claim {
  id: string;
  serviceDate: string;
  provider: string;
  service: string;
  billed: number;
  planPaid: number;
  memberOwes: number;
  status: 'paid' | 'processing' | 'denied' | 'appealed';
}

export interface PriorAuthorization {
  id: string;
  service: string;
  requestedBy: string;
  submitted: string;
  status: 'approved' | 'pending' | 'denied';
  expires?: string;
}

export interface MemberRecord {
  memberId: string;
  name: string;
  dateOfBirth: string;
  program: string;
  plan: {
    name: string;
    groupNumber: string;
    effectiveDate: string;
    status: 'active' | 'termed' | 'pending';
    network: string;
    pcp: string;
  };
  accumulators: {
    deductible: { met: number; limit: number };
    outOfPocket: { met: number; limit: number };
  };
  eligibility: {
    medical: boolean;
    behavioralHealth: boolean;
    pharmacy: boolean;
    dental: boolean;
    vision: boolean;
  };
  claims: Claim[];
  priorAuths: PriorAuthorization[];
  flags: string[];
}

/** Result of a member lookup by ID. */
export type LookupResult =
  | { kind: 'found'; record: MemberRecord }
  | { kind: 'not-found'; memberId: string }
  | { kind: 'no-query' };
