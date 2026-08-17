import { Alert, Avatar, Badge, Button, Card, CardBody, CardHeader } from '@optum-serve/ds';
import { useMemo } from 'react';
import { lookupMember, SAMPLE_MEMBER_IDS } from '@/data/members';
import { MemberDetail } from '@/components/MemberDetail';

/** Context handed to the member tab. Sourced from the active/last contact's
 *  call metadata, or from launch query params when no call has occurred. */
export interface MemberContext {
  callerName: string | null;
  memberId: string | null;
  contactId: string | null;
  queue: string | null;
  /** true while the sourcing contact is still active (not yet closed) */
  live: boolean;
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function MemberLookupTab({
  context,
  onSimulate,
}: {
  context: MemberContext | null;
  onSimulate?: () => void;
}) {
  const result = useMemo(() => lookupMember(context?.memberId ?? null), [context?.memberId]);

  if (!context || (context.callerName === null && context.memberId === null)) {
    return (
      <div className="flex flex-col gap-4">
        <Alert status="info" title="No member context yet">
          Accept a contact on the Landing Page tab and the caller's record will screen-pop here
          automatically, keyed by the <code className="font-mono text-xs">memberId</code> in the call
          metadata.
        </Alert>
        {onSimulate && (
          <Card>
            <CardHeader title="Try it" subtitle="Simulate an incoming contact" />
            <CardBody>
              <p className="mb-3 text-sm text-[var(--os-text-secondary)]">
                Sample members on file: {SAMPLE_MEMBER_IDS.map((m) => m.name).join(', ')}.
              </p>
              <Button variant="secondary" size="sm" onClick={onSimulate}>
                Simulate incoming contact
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }

  const displayName = result.kind === 'found' ? result.record.name : context.callerName ?? 'Member lookup';

  const nameMismatch =
    result.kind === 'found' &&
    context.callerName !== null &&
    context.callerName.trim().toLowerCase() !== result.record.name.trim().toLowerCase();

  return (
    <div className="flex flex-col gap-4">
      {/* Title identifying the caller/member */}
      <header className="flex items-center gap-4">
        <Avatar initials={initialsOf(displayName)} name={displayName} />
        <div>
          <h1 className="text-2xl font-medium text-[#1A2B4A]">{displayName}</h1>
          <p className="text-sm text-[var(--os-text-secondary)]">
            {result.kind === 'found' ? (
              <>
                Member ID <span className="font-mono">{result.record.memberId}</span>
                {' · '}
                {result.record.program}
              </>
            ) : context.memberId ? (
              <>
                Member ID <span className="font-mono">{context.memberId}</span>
              </>
            ) : (
              'No member ID in call metadata'
            )}
            {context.queue ? ` · via ${context.queue}` : ''}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {context.contactId && (
            <Badge color="gray">Contact {context.contactId.slice(0, 10)}</Badge>
          )}
          <Badge color={context.live ? 'green' : 'gray'} dot>
            {context.live ? 'Active contact' : 'Last contact'}
          </Badge>
        </div>
      </header>

      {nameMismatch && (
        <Alert status="warning" title="Verify caller identity">
          The caller identified as “{context.callerName}”, but member{' '}
          {result.kind === 'found' ? result.record.memberId : ''} is on file as “
          {result.kind === 'found' ? result.record.name : ''}”. Complete identity verification before
          discussing protected health information.
        </Alert>
      )}

      {result.kind === 'found' && <MemberDetail record={result.record} />}

      {result.kind === 'not-found' && (
        <Alert status="error" title="Member not found">
          No record matches member ID “{result.memberId}”. Confirm the ID with the caller, or search
          the eligibility system directly.
        </Alert>
      )}

      {result.kind === 'no-query' && (
        <Alert status="error" title="No member ID in call metadata">
          This contact arrived without a <code className="font-mono text-xs">memberId</code> attribute.
          Ask the caller for their member ID, or check the contact flow's attribute mapping.
        </Alert>
      )}
    </div>
  );
}
