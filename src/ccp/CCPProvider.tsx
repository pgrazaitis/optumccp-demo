import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import 'amazon-connect-streams';
import { appConfig } from '@/config';
import { randomSampleContact } from './simulation';
import type {
  AgentStateName,
  ContactPhase,
  DailyStats,
  EventLogEntry,
  ScreenPopData,
} from '@/types/contact';

/* ------------------------------------------------------------------ */
/*  Context shape                                                      */
/* ------------------------------------------------------------------ */

interface CCPContextValue {
  mode: 'live' | 'demo';
  ccpInitialized: boolean;
  agentState: AgentStateName;
  setAgentState: (s: AgentStateName) => void;
  phase: ContactPhase;
  contact: ScreenPopData | null;
  muted: boolean;
  callSeconds: number;
  stats: DailyStats;
  events: EventLogEntry[];
  /** container element for the hidden embedded CCP iframe (live mode) */
  ccpContainerRef: React.RefObject<HTMLDivElement>;
  // actions
  acceptContact: () => void;
  toggleHold: () => void;
  toggleMute: () => void;
  endContact: () => void;
  completeAcw: () => void;
  simulateIncoming: () => void;
}

const CCPContext = createContext<CCPContextValue | null>(null);

export function useCCP(): CCPContextValue {
  const ctx = useContext(CCPContext);
  if (!ctx) throw new Error('useCCP must be used inside <CCPProvider>');
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function nowTime(): string {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, '0'))
    .join(':');
}

/** Map a Streams contact into the normalized screen-pop shape.
 *  Contact-flow attribute keys expected (all optional):
 *  customerName, memberId, program, accountTier, location, ivrPath,
 *  plus anything else — everything is surfaced in the attributes list. */
function toScreenPop(contact: connect.Contact): ScreenPopData {
  const rawAttrs = contact.getAttributes() ?? {};
  const attrs: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawAttrs)) {
    attrs[k] = (v as { value: string }).value;
  }
  const endpoint = contact.getInitialConnection()?.getEndpoint();
  return {
    contactId: contact.getContactId(),
    phone: endpoint?.phoneNumber ?? 'Unknown',
    queue: contact.getQueue()?.name ?? '—',
    channel: contact.getType(),
    ivrPath: attrs.ivrPath ?? '—',
    attributes: attrs,
    customer: {
      name: attrs.customerName ?? 'Unknown caller',
      memberId: attrs.memberId ?? '—',
      program: attrs.program ?? '—',
      tier: attrs.accountTier ?? '—',
      location: attrs.location ?? '—',
    },
    history: [], // populate from your CRM/API using attrs.memberId
  };
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function CCPProvider({ children }: { children: React.ReactNode }) {
  const mode: 'live' | 'demo' = appConfig.isLiveMode ? 'live' : 'demo';

  const [ccpInitialized, setCcpInitialized] = useState(false);
  const [agentState, setAgentStateInternal] = useState<AgentStateName>('Available');
  const [phase, setPhase] = useState<ContactPhase>('idle');
  const [contact, setContact] = useState<ScreenPopData | null>(null);
  const [muted, setMuted] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [stats, setStats] = useState<DailyStats>({ handled: 0, avgHandleSeconds: null });
  const [events, setEvents] = useState<EventLogEntry[]>([]);

  const ccpContainerRef = useRef<HTMLDivElement>(null);
  const liveContactRef = useRef<connect.Contact | null>(null);
  const liveAgentRef = useRef<connect.Agent | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callStartRef = useRef<number | null>(null);
  const eventIdRef = useRef(0);
  const handleTotalsRef = useRef({ total: 0, count: 0 });

  const log = useCallback((message: string, level: EventLogEntry['level'] = 'info') => {
    setEvents((prev) => {
      const entry: EventLogEntry = { id: ++eventIdRef.current, time: nowTime(), message, level };
      return [entry, ...prev].slice(0, 50);
    });
  }, []);

  /* ---- call timer ---- */
  const startTimer = useCallback(() => {
    callStartRef.current = Date.now();
    setCallSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (callStartRef.current) {
        setCallSeconds(Math.floor((Date.now() - callStartRef.current) / 1000));
      }
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const recordHandle = useCallback(() => {
    if (!callStartRef.current) return;
    const dur = Math.floor((Date.now() - callStartRef.current) / 1000);
    handleTotalsRef.current.total += dur;
    handleTotalsRef.current.count += 1;
    const { total, count } = handleTotalsRef.current;
    setStats({ handled: count, avgHandleSeconds: Math.round(total / count) });
  }, []);

  const resetToIdle = useCallback(() => {
    stopTimer();
    callStartRef.current = null;
    liveContactRef.current = null;
    setContact(null);
    setPhase('idle');
    setMuted(false);
    setCallSeconds(0);
  }, [stopTimer]);

  /* ---- live CCP init ---- */
  useEffect(() => {
    if (mode !== 'live') return;
    const container = ccpContainerRef.current;
    if (!container || ccpInitialized) return;

    connect.core.initCCP(container, {
      ccpUrl: appConfig.ccpUrl,
      region: appConfig.region,
      loginPopup: true,
      loginPopupAutoClose: true,
      softphone: { allowFramedSoftphone: true },
      pageOptions: { enableAudioDeviceSettings: true, enablePhoneTypeSettings: true },
    });

    connect.core.onInitialized(() => {
      setCcpInitialized(true);
      log('CCP initialized');
    });

    connect.agent((agent) => {
      liveAgentRef.current = agent;
      log(`Agent signed in — ${agent.getName()}`);
      agent.onStateChange((s) => log(`Agent state → ${s.newState}`));
    });

    connect.contact((c) => {
      liveContactRef.current = c;

      c.onConnecting(() => {
        setContact(toScreenPop(c));
        setPhase('incoming');
        log(`Incoming ${c.getType()} — contact ${c.getContactId().slice(0, 8)}`);
      });

      c.onConnected(() => {
        // refresh attributes — Lambda-set attrs may land after connecting
        setContact(toScreenPop(c));
        setPhase('connected');
        startTimer();
        log('Contact connected');
      });

      c.onACW(() => {
        setPhase('acw');
        stopTimer();
        recordHandle();
        log('After-contact work started');
      });

      c.onEnded(() => {
        log('Contact ended');
      });

      c.onDestroy(() => {
        resetToIdle();
        log('Contact closed');
      });
    });

    connect.core.onAuthFail(() => log('Authentication failed — sign in again', 'error'));
    connect.core.onAccessDenied(() => log('Access denied by Connect instance', 'error'));
  }, [mode, ccpInitialized, log, startTimer, stopTimer, recordHandle, resetToIdle]);

  /* ---- actions (live + demo paths) ---- */

  const setAgentState = useCallback(
    (s: AgentStateName) => {
      setAgentStateInternal(s);
      log(`Status → ${s}`);
      if (mode === 'live' && liveAgentRef.current) {
        const agent = liveAgentRef.current;
        const target = agent
          .getAgentStates()
          .find((st) =>
            s === 'Available'
              ? st.type === connect.AgentStateType.ROUTABLE
              : st.name.toLowerCase().includes(s.toLowerCase())
          );
        if (target) {
          agent.setState(target, {
            success: () => {},
            failure: () => log('Could not change agent state', 'warn'),
          });
        }
      }
    },
    [mode, log]
  );

  const acceptContact = useCallback(() => {
    if (mode === 'live' && liveContactRef.current) {
      liveContactRef.current.accept({
        success: () => {},
        failure: () => log('Accept failed', 'error'),
      });
      return; // onConnected handler moves the phase
    }
    setPhase('connected');
    startTimer();
    log('Contact accepted');
  }, [mode, log, startTimer]);

  const toggleHold = useCallback(() => {
    const holding = phase !== 'held';
    if (mode === 'live' && liveContactRef.current) {
      const conn = liveContactRef.current.getInitialConnection();
      if (holding) conn.hold({ success: () => {}, failure: () => log('Hold failed', 'error') });
      else conn.resume({ success: () => {}, failure: () => log('Resume failed', 'error') });
    }
    setPhase(holding ? 'held' : 'connected');
    log(holding ? 'Contact on hold' : 'Contact resumed');
  }, [mode, phase, log]);

  const toggleMute = useCallback(() => {
    const next = !muted;
    if (mode === 'live' && liveAgentRef.current) {
      if (next) liveAgentRef.current.mute();
      else liveAgentRef.current.unmute();
    }
    setMuted(next);
    log(next ? 'Muted' : 'Unmuted');
  }, [mode, muted, log]);

  const endContact = useCallback(() => {
    if (mode === 'live' && liveContactRef.current) {
      liveContactRef.current
        .getAgentConnection()
        .destroy({ success: () => {}, failure: () => log('End contact failed', 'error') });
      return; // onACW handler moves the phase
    }
    setPhase('acw');
    stopTimer();
    recordHandle();
    log('Contact ended — after-contact work');
  }, [mode, log, stopTimer, recordHandle]);

  const completeAcw = useCallback(() => {
    if (mode === 'live' && liveContactRef.current) {
      liveContactRef.current.clear({
        success: () => {},
        failure: () => log('Could not close contact', 'error'),
      });
      return; // onDestroy handler resets
    }
    resetToIdle();
    log('After-contact work complete — ready');
  }, [mode, log, resetToIdle]);

  const simulateIncoming = useCallback(() => {
    if (phase !== 'idle') {
      log('Already handling a contact', 'warn');
      return;
    }
    const c = randomSampleContact();
    setContact(c);
    setPhase('incoming');
    log(`Incoming voice — ${c.phone}`);
  }, [phase, log]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const value = useMemo<CCPContextValue>(
    () => ({
      mode,
      ccpInitialized,
      agentState,
      setAgentState,
      phase,
      contact,
      muted,
      callSeconds,
      stats,
      events,
      ccpContainerRef,
      acceptContact,
      toggleHold,
      toggleMute,
      endContact,
      completeAcw,
      simulateIncoming,
    }),
    [
      mode,
      ccpInitialized,
      agentState,
      setAgentState,
      phase,
      contact,
      muted,
      callSeconds,
      stats,
      events,
      acceptContact,
      toggleHold,
      toggleMute,
      endContact,
      completeAcw,
      simulateIncoming,
    ]
  );

  return <CCPContext.Provider value={value}>{children}</CCPContext.Provider>;
}
