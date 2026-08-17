# Optum Serve · Agent workspace

A unified React + TypeScript SPA combining the **Amazon Connect agent desktop** and the **member lookup** application into one tabbed workspace, styled with the Optum Serve Design System and compiled to a static bundle for S3 + CloudFront.

## The two tabs

**Landing Page** — the agent desktop: Streams-driven screen pop card (caller identity, queue, IVR path, contact attributes, history, notes), call controls (accept, hold, mute, end, complete ACW), agent status, daily stats, and the event log.

**Member lookup** — the health-insurance record view: coverage and benefit eligibility, YTD deductible/out-of-pocket accumulators, claims, prior authorizations, and account flags, titled with the caller/member's name.

## The screen-pop flow

1. A contact arrives (Streams `connect.contact` in live mode, or *Simulate incoming contact* in demo mode). The workspace switches to the **Landing Page** tab showing the ringing contact card.
2. The agent **accepts**. The contact's call metadata — `callerName` and `memberId` from the contact-flow attributes — becomes the member context, and the workspace **auto-switches to the Member lookup tab** with the matching record already loaded.
3. The record stays up through the call and after-contact work (badged *Active contact* → *Last contact*).
4. The **next call replaces the context** — each accepted contact pops its own member record.

Supporting behaviors:

- **Identity mismatch guard** — if the metadata `callerName` doesn't match the record's canonical name, a *Verify caller identity* warning renders before any PHI content.
- **Unknown member** — a contact without a valid `memberId` (e.g. the unauthenticated provider-services sim) shows a member-not-found / missing-metadata alert instead of a record.
- **Tab badges** — the Member lookup tab shows the current member's first name (or `!` on lookup failure); the Landing Page tab shows an activity dot during a contact.
- **Third-party launch fallback** — opening the app directly with `?callerName=…&memberId=…` seeds the member tab before any call, preserving the standalone integration contract.

## Metadata contract (live mode)

Set these contact attributes in your flow (typically via a Lambda ANI/member lookup + *Set contact attributes* block):

| Attribute | Drives |
|---|---|
| `memberId` | Record selection in the member lookup tab |
| `customerName` | Caller name (title fallback + identity check) |
| `program`, `accountTier`, `location`, `ivrPath` | Screen pop fields |

All other attributes are displayed automatically in the screen pop's attribute list.

## Demo mode

With no `VITE_CONNECT_CCP_URL` set, four simulated contacts exercise every path: Robert Delgado (active coverage, appeal in progress), Angela Whitfield (exam program, no cost share), Marcus Okafor (termed coverage, denied claim), and an unauthenticated unknown caller (member-not-found path).

## Develop, build, deploy

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
```

Live mode: copy `.env.example` to `.env`, set `VITE_CONNECT_CCP_URL` (your instance's ccp-v2 URL) and `VITE_CONNECT_REGION`, and allowlist your CloudFront domain in the Connect instance's **Approved origins** (HTTPS required).

Infrastructure and releases (private S3 + CloudFront with OAC, SPA fallback, cache-correct sync):

```bash
aws cloudformation deploy \
  --template-file deploy/infra.yaml \
  --stack-name optum-agent-workspace \
  --parameter-overrides BucketName=my-unique-bucket-name

S3_BUCKET=my-unique-bucket-name CF_DISTRIBUTION_ID=E123ABCDEF ./deploy/deploy.sh
```

## Architecture notes

- `src/ccp/CCPProvider.tsx` — Streams integration (initCCP, agent/contact subscriptions, actions) with an identical-shape demo fallback. The screen-pop normalizer maps contact attributes into `ScreenPopData`, including `customer.memberId`.
- `src/pages/Workspace.tsx` — owns tab state and the member context. Watches contact/phase: incoming → Landing Page; incoming→connected transition → Member lookup; contact close → context retained but marked historical.
- `src/data/members.ts` — sample insurance dataset; swap `lookupMember()` for your eligibility API to go live.
- UI is built entirely from the vendored Optum Serve DS (`Tabs`, `NavBar`, `Card`, `Badge`, `Alert`, `DataTable`, `ProgressBar`, `StatCard`, `RadioGroup`, …) with its WCAG AA conventions.
