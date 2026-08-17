import {
  Alert,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DataTable,
  Divider,
  FieldWrapper,
  Textarea,
} from '@optum-serve/ds';
import type { Column } from '@optum-serve/ds';
import { useState } from 'react';
import { useCCP } from '@/ccp/CCPProvider';
import type { ContactPhase, InteractionHistoryItem } from '@/types/contact';
import { CallControls } from './CallControls';

function phaseBadge(phase: ContactPhase) {
  switch (phase) {
    case 'incoming':
      return <Badge color="amber" dot>Ringing</Badge>;
    case 'connected':
      return <Badge color="green" dot>Connected</Badge>;
    case 'held':
      return <Badge color="blue" dot>On hold</Badge>;
    case 'acw':
      return <Badge color="orange" dot>After-contact work</Badge>;
    default:
      return null;
  }
}

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

const historyColumns: Column<InteractionHistoryItem>[] = [
  { key: 'date', header: 'Date' },
  { key: 'channel', header: 'Channel' },
  { key: 'summary', header: 'Summary' },
  {
    key: 'outcome',
    header: 'Outcome',
    render: (r) => (
      <Badge color={r.outcome === 'resolved' ? 'green' : r.outcome === 'escalated' ? 'amber' : 'red'}>
        {r.outcome}
      </Badge>
    ),
  },
];

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ScreenPop() {
  const { phase, contact, callSeconds, muted } = useCCP();
  const [notes, setNotes] = useState('');

  if (phase === 'idle' || !contact) {
    return (
      <Card>
        <CardBody>
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-[var(--os-text-secondary)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .95.68l1.5 4.5a1 1 0 0 1-.5 1.21l-2.26 1.13a11 11 0 0 0 5.52 5.52l1.13-2.26a1 1 0 0 1 1.21-.5l4.5 1.5a1 1 0 0 1 .68.95V19a2 2 0 0 1-2 2h-1C9.72 21 3 14.28 3 6V5z" />
            </svg>
            <p className="text-sm">Waiting for the next contact</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const c = contact;
  const attrs = Object.entries(c.attributes);

  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      {phase === 'incoming' && (
        <Alert status="info" title="Incoming contact">
          {c.customer.name} is calling from {c.phone} via the {c.queue} queue.
        </Alert>
      )}
      {muted && (
        <Alert status="warning">Your microphone is muted.</Alert>
      )}

      <Card>
        <CardHeader
          title={c.customer.name}
          subtitle={`${c.customer.program} · ${c.customer.location}`}
          badge={phaseBadge(phase)}
        />
        <CardBody>
          <div className="mb-4 flex items-center gap-3">
            <Avatar initials={initialsOf(c.customer.name)} name={c.customer.name} />
            <div className="text-sm text-[var(--os-text-secondary)]">
              Member ID <span className="font-medium text-[var(--os-text-primary)]">{c.customer.memberId}</span>
              {' · '}Tier <span className="font-medium text-[var(--os-text-primary)]">{c.customer.tier}</span>
            </div>
            <div className="ml-auto font-mono text-sm text-[var(--os-text-secondary)]" aria-label="Call timer">
              {formatSeconds(callSeconds)}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            <DetailRow label="Phone" value={c.phone} link />
            <DetailRow label="Contact ID" value={c.contactId} mono />
            <DetailRow label="Queue" value={c.queue} />
            <DetailRow label="Channel" value={c.channel} />
            <DetailRow label="IVR path" value={c.ivrPath} />
          </div>

          {attrs.length > 0 && (
            <>
              <Divider className="my-4" />
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--os-text-secondary)]">
                Contact attributes
              </p>
              <div className="flex flex-wrap gap-2">
                {attrs.map(([k, v]) => (
                  <Badge key={k} color="gray">
                    {k}: {v}
                  </Badge>
                ))}
              </div>
            </>
          )}

          <Divider className="my-4" />
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--os-text-secondary)]">
            Recent interactions
          </p>
          {c.history.length > 0 ? (
            <DataTable columns={historyColumns} data={c.history} rowKey="id" caption="Recent interactions" />
          ) : (
            <p className="text-sm text-[var(--os-text-secondary)]">No prior interactions on file.</p>
          )}

          <Divider className="my-4" />
          <FieldWrapper label="Contact notes" htmlFor="contact-notes" hint="Saved with the contact record">
            <Textarea
              id="contact-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Summarize the reason for contact and any follow-up needed"
            />
          </FieldWrapper>
        </CardBody>
        <CardFooter>
          <CallControls />
        </CardFooter>
      </Card>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
  link,
}: {
  label: string;
  value: string;
  mono?: boolean;
  link?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--os-border-default)] py-1.5 text-sm last:border-b-0 sm:border-b-0">
      <span className="text-[var(--os-text-secondary)]">{label}</span>
      <span
        className={[
          mono ? 'font-mono text-xs' : '',
          link ? 'text-[var(--os-color-link)]' : 'text-[var(--os-text-primary)]',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}
