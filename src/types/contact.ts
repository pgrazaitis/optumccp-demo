/** Contact lifecycle phases surfaced to the UI. */
export type ContactPhase = 'idle' | 'incoming' | 'connected' | 'held' | 'acw';

export type AgentStateName = 'Available' | 'On break' | 'Training' | 'Offline';

export interface InteractionHistoryItem {
  id: string;
  channel: 'voice' | 'chat' | 'email';
  summary: string;
  date: string;
  outcome: 'resolved' | 'escalated' | 'missed';
}

/** Everything the screen pop needs to render, normalized from Streams
 *  contact attributes or from the simulator. */
export interface ScreenPopData {
  contactId: string;
  phone: string;
  queue: string;
  channel: string;
  /** Attributes set by the contact flow (Set contact attributes block). */
  attributes: Record<string, string>;
  customer: {
    name: string;
    memberId: string;
    program: string; // e.g. VA CCN Region 3, LHI exam
    tier: string;
    location: string;
  };
  ivrPath: string;
  history: InteractionHistoryItem[];
}

export interface EventLogEntry {
  id: number;
  time: string;
  message: string;
  level: 'info' | 'warn' | 'error';
}

export interface DailyStats {
  handled: number;
  avgHandleSeconds: number | null;
}
