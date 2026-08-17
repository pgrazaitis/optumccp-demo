import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardHeader,
  DataTable,
  Divider,
  ProgressBar,
  StatCard,
} from '@optum-serve/ds';
import type { Column } from '@optum-serve/ds';
import type { Claim, MemberRecord, PriorAuthorization } from '@/types/member';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function claimStatusBadge(status: Claim['status']) {
  const color =
    status === 'paid' ? 'green' : status === 'processing' ? 'blue' : status === 'appealed' ? 'amber' : 'red';
  return <Badge color={color}>{status}</Badge>;
}

const claimColumns: Column<Claim>[] = [
  { key: 'serviceDate', header: 'Service date' },
  { key: 'id', header: 'Claim #', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
  { key: 'provider', header: 'Provider' },
  { key: 'service', header: 'Service' },
  { key: 'billed', header: 'Billed', align: 'right', render: (r) => usd.format(r.billed) },
  { key: 'planPaid', header: 'Plan paid', align: 'right', render: (r) => usd.format(r.planPaid) },
  { key: 'memberOwes', header: 'Member owes', align: 'right', render: (r) => usd.format(r.memberOwes) },
  { key: 'status', header: 'Status', render: (r) => claimStatusBadge(r.status) },
];

const paColumns: Column<PriorAuthorization>[] = [
  { key: 'id', header: 'Auth #', render: (r) => <span className="font-mono text-xs">{r.id}</span> },
  { key: 'service', header: 'Service' },
  { key: 'requestedBy', header: 'Requested by' },
  { key: 'submitted', header: 'Submitted' },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <Badge color={r.status === 'approved' ? 'green' : r.status === 'pending' ? 'blue' : 'red'}>
        {r.status}
        {r.expires ? ` · expires ${r.expires}` : ''}
      </Badge>
    ),
  },
];

function pct(met: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((met / limit) * 100));
}

export function MemberDetail({ record }: { record: MemberRecord }) {
  const m = record;
  const eligible = Object.entries(m.eligibility) as [string, boolean][];
  const benefitLabels: Record<string, string> = {
    medical: 'Medical',
    behavioralHealth: 'Behavioral health',
    pharmacy: 'Pharmacy',
    dental: 'Dental',
    vision: 'Vision',
  };

  return (
    <div className="flex flex-col gap-4">
      {m.flags.map((f) => (
        <Alert key={f} status="warning" title="Account flag">
          {f}
        </Alert>
      ))}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Coverage"
            badge={
              <Badge color={m.plan.status === 'active' ? 'green' : m.plan.status === 'pending' ? 'blue' : 'red'} dot>
                {m.plan.status === 'active' ? 'Active' : m.plan.status === 'pending' ? 'Pending' : 'Termed'}
              </Badge>
            }
          />
          <CardBody>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
              <dt className="text-[var(--os-text-secondary)]">Plan</dt>
              <dd>{m.plan.name}</dd>
              <dt className="text-[var(--os-text-secondary)]">Group #</dt>
              <dd className="font-mono text-xs leading-5">{m.plan.groupNumber}</dd>
              <dt className="text-[var(--os-text-secondary)]">Effective</dt>
              <dd>{m.plan.effectiveDate}</dd>
              <dt className="text-[var(--os-text-secondary)]">Network</dt>
              <dd>{m.plan.network}</dd>
              <dt className="text-[var(--os-text-secondary)]">PCP</dt>
              <dd>{m.plan.pcp}</dd>
              <dt className="text-[var(--os-text-secondary)]">Date of birth</dt>
              <dd>{m.dateOfBirth}</dd>
            </dl>
            <Divider className="my-3" />
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--os-text-secondary)]">
              Covered benefits
            </p>
            <div className="flex flex-wrap gap-2">
              {eligible.map(([k, v]) => (
                <Badge key={k} color={v ? 'teal' : 'gray'}>
                  {benefitLabels[k]}: {v ? 'Covered' : 'Not covered'}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Year-to-date accumulators" subtitle="Plan year 2026" />
          <CardBody>
            {m.accumulators.deductible.limit > 0 || m.accumulators.outOfPocket.limit > 0 ? (
              <div className="flex flex-col gap-5">
                <div>
                  <ProgressBar
                    value={pct(m.accumulators.deductible.met, m.accumulators.deductible.limit)}
                    label={`Deductible — ${usd.format(m.accumulators.deductible.met)} of ${usd.format(m.accumulators.deductible.limit)}`}
                    color="orange"
                  />
                </div>
                <div>
                  <ProgressBar
                    value={pct(m.accumulators.outOfPocket.met, m.accumulators.outOfPocket.limit)}
                    label={`Out-of-pocket max — ${usd.format(m.accumulators.outOfPocket.met)} of ${usd.format(m.accumulators.outOfPocket.limit)}`}
                    color="blue"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Deductible remaining"
                    value={usd.format(Math.max(0, m.accumulators.deductible.limit - m.accumulators.deductible.met))}
                  />
                  <StatCard
                    label="OOP remaining"
                    value={usd.format(Math.max(0, m.accumulators.outOfPocket.limit - m.accumulators.outOfPocket.met))}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--os-text-secondary)]">
                No cost share applies to this program.
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent claims" subtitle={`${m.claims.length} on file`} />
        <CardBody>
          {m.claims.length > 0 ? (
            <DataTable columns={claimColumns} data={m.claims} rowKey="id" caption="Recent claims" />
          ) : (
            <p className="text-sm text-[var(--os-text-secondary)]">No claims on file.</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Prior authorizations" />
        <CardBody>
          {m.priorAuths.length > 0 ? (
            <DataTable columns={paColumns} data={m.priorAuths} rowKey="id" caption="Prior authorizations" />
          ) : (
            <p className="text-sm text-[var(--os-text-secondary)]">No prior authorizations on file.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
