import { Avatar, Badge, NavBar, Tabs } from '@optum-serve/ds';
import { useEffect, useRef, useState } from 'react';
import { useCCP } from '@/ccp/CCPProvider';
import { ScreenPop } from '@/components/ScreenPop';
import { Sidebar } from '@/components/Sidebar';
import { MemberLookupTab, type MemberContext } from '@/components/MemberLookupTab';
import { useCallMetadata } from '@/useCallMetadata';
import { lookupMember } from '@/data/members';

type TabId = 'desk' | 'member';

export function Workspace() {
  const { mode, ccpInitialized, ccpContainerRef, contact, phase, simulateIncoming } = useCCP();
  const launchMeta = useCallMetadata();
  const [activeTab, setActiveTab] = useState<TabId>('desk');

  // Member context: derived from the current contact's call metadata and
  // retained after the contact closes so wrap-up work can continue. Each new
  // contact replaces it — the member tab always reflects the latest call.
  const [memberContext, setMemberContext] = useState<MemberContext | null>(() =>
    launchMeta.memberId || launchMeta.callerName
      ? { ...launchMeta, live: false } // third-party launch via query params
      : null
  );

  useEffect(() => {
    if (contact) {
      setMemberContext({
        callerName: contact.customer.name === 'Unknown caller' ? null : contact.customer.name,
        memberId: contact.customer.memberId === '—' ? null : contact.customer.memberId,
        contactId: contact.contactId,
        queue: contact.queue,
        live: true,
      });
    } else {
      // contact closed — keep context for wrap-up, mark it historical
      setMemberContext((prev) => (prev ? { ...prev, live: false } : prev));
    }
  }, [contact]);

  // Screen pop: when a contact is accepted (connected), jump to the member
  // tab so the record is in front of the agent as the conversation starts.
  const prevPhase = useRef(phase);
  useEffect(() => {
    if (phase === 'connected' && prevPhase.current === 'incoming') {
      setActiveTab('member');
    }
    if (phase === 'incoming') {
      setActiveTab('desk'); // ringing → show the contact card & accept button
    }
    prevPhase.current = phase;
  }, [phase]);

  const memberTabBadge = (() => {
    if (!memberContext?.memberId) return undefined;
    const r = lookupMember(memberContext.memberId);
    return r.kind === 'found' ? r.record.name.split(' ')[0] : '!';
  })();

  return (
    <div className="min-h-screen bg-[var(--os-bg-page)]">
      <NavBar
        productName="Optum Serve · Agent workspace"
        links={[]}
        actions={
          <>
            {mode === 'live' ? (
              <Badge color={ccpInitialized ? 'green' : 'amber'} dot>
                {ccpInitialized ? 'CCP connected' : 'Connecting to CCP'}
              </Badge>
            ) : (
              <Badge color="blue">Demo mode</Badge>
            )}
            <Avatar initials="AG" name="Agent" />
          </>
        }
      />

      <main className="mx-auto max-w-6xl px-4 py-4">
        <Tabs
          aria-label="Workspace"
          tabs={[
            { id: 'desk', label: 'Landing Page', badge: phase !== 'idle' ? '●' : undefined },
            { id: 'member', label: 'Member lookup', badge: memberTabBadge },
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as TabId)}
          className="mb-6"
        />

        <div role="tabpanel" id="panel-desk" aria-labelledby="tab-desk" hidden={activeTab !== 'desk'}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <section aria-label="Screen pop">
              <ScreenPop />
            </section>
            <aside aria-label="Agent tools">
              <Sidebar />
            </aside>
          </div>
        </div>

        <div role="tabpanel" id="panel-member" aria-labelledby="tab-member" hidden={activeTab !== 'member'}>
          <MemberLookupTab context={memberContext} onSimulate={simulateIncoming} />
        </div>
      </main>

      {/* Embedded CCP iframe target (hidden; Streams drives it). */}
      <div
        ref={ccpContainerRef}
        id="ccp-container"
        style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}
        aria-hidden="true"
      />
    </div>
  );
}
