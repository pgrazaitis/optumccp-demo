import { Badge, Button, Card, CardBody, CardHeader, RadioGroup, StatCard } from '@optum-serve/ds';
import { useCCP } from '@/ccp/CCPProvider';
import type { AgentStateName } from '@/types/contact';

const AGENT_STATES: { value: AgentStateName; label: string; description?: string }[] = [
  { value: 'Available', label: 'Available', description: 'Ready to receive contacts' },
  { value: 'On break', label: 'On break' },
  { value: 'Training', label: 'Training' },
  { value: 'Offline', label: 'Offline' },
];

function formatAvg(seconds: number | null): string {
  if (seconds === null) return '—';
  const m = Math.floor(seconds / 60);
  return `${m}:${String(seconds % 60).padStart(2, '0')}`;
}

export function Sidebar() {
  const { mode, agentState, setAgentState, stats, events, simulateIncoming, phase } = useCCP();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader
          title="Agent status"
          badge={
            <Badge color={agentState === 'Available' ? 'green' : agentState === 'Offline' ? 'gray' : 'amber'} dot>
              {agentState}
            </Badge>
          }
        />
        <CardBody>
          <RadioGroup
            name="agent-state"
            value={agentState}
            onChange={(v) => setAgentState(v as AgentStateName)}
            options={AGENT_STATES}
          />
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Contacts handled" value={String(stats.handled)} />
        <StatCard label="Avg handle time" value={formatAvg(stats.avgHandleSeconds)} />
      </div>

      {mode === 'demo' && (
        <Card>
          <CardHeader title="Demo mode" subtitle="No Connect instance configured" />
          <CardBody>
            <p className="mb-3 text-sm text-[var(--os-text-secondary)]">
              Set <code className="font-mono text-xs">VITE_CONNECT_CCP_URL</code> to go live. Until
              then, trigger a simulated screen pop.
            </p>
            <Button variant="ghost" size="sm" fullWidth onClick={simulateIncoming} disabled={phase !== 'idle'}>
              Simulate incoming contact
            </Button>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="Event log" />
        <CardBody>
          <ul className="max-h-56 space-y-1 overflow-y-auto font-mono text-xs" aria-live="polite">
            {events.length === 0 && (
              <li className="text-[var(--os-text-secondary)]">No events yet</li>
            )}
            {events.map((e) => (
              <li key={e.id} className="flex gap-2 border-b border-[var(--os-border-default)] pb-1 last:border-b-0">
                <span className="text-[var(--os-text-secondary)]">{e.time}</span>
                <span
                  className={
                    e.level === 'error'
                      ? 'text-[var(--os-color-error)]'
                      : e.level === 'warn'
                        ? 'text-[#E65100]'
                        : 'text-[var(--os-text-primary)]'
                  }
                >
                  {e.message}
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
