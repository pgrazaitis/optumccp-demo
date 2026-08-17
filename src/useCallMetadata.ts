import { useEffect, useState } from 'react';

export interface CallMetadata {
  callerName: string | null;
  memberId: string | null;
  /** Extra metadata commonly passed by contact-flow URL templates. */
  contactId: string | null;
  queue: string | null;
}

function readParams(): CallMetadata {
  const params = new URLSearchParams(window.location.search);
  const clean = (v: string | null) => {
    const t = v?.trim() ?? '';
    return t === '' ? null : t;
  };
  return {
    callerName: clean(params.get('callerName')),
    memberId: clean(params.get('memberId')),
    contactId: clean(params.get('contactId')),
    queue: clean(params.get('queue')),
  };
}

/** Reads call metadata from the query string. Third-party app integrations
 *  (e.g. an Amazon Connect agent workspace or CRM) launch this page as:
 *
 *    https://<host>/?callerName=Robert%20Delgado&memberId=VET-1104829
 *
 *  Re-reads on popstate so history navigation between contacts works. */
export function useCallMetadata(): CallMetadata {
  const [meta, setMeta] = useState<CallMetadata>(readParams);

  useEffect(() => {
    const onNav = () => setMeta(readParams());
    window.addEventListener('popstate', onNav);
    return () => window.removeEventListener('popstate', onNav);
  }, []);

  return meta;
}
