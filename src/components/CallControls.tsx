import { Button } from '@optum-serve/ds';
import { useCCP } from '@/ccp/CCPProvider';

export function CallControls() {
  const { phase, muted, acceptContact, toggleHold, toggleMute, endContact, completeAcw } = useCCP();

  if (phase === 'idle') return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {phase === 'incoming' && (
        <Button variant="primary" onClick={acceptContact}>
          Accept contact
        </Button>
      )}

      {(phase === 'connected' || phase === 'held') && (
        <>
          <Button variant="secondary" size="sm" onClick={toggleHold}>
            {phase === 'held' ? 'Resume' : 'Hold'}
          </Button>
          <Button variant="secondary" size="sm" onClick={toggleMute}>
            {muted ? 'Unmute' : 'Mute'}
          </Button>
          <div className="flex-1" />
          <Button variant="danger" size="sm" onClick={endContact}>
            End contact
          </Button>
        </>
      )}

      {phase === 'acw' && (
        <Button variant="primary" onClick={completeAcw}>
          Complete after-contact work
        </Button>
      )}
    </div>
  );
}
