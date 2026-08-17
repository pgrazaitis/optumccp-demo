# Optum Serve Design System — Claude Code Reference

This file tells Claude Code everything it needs to build React apps using the Optum Serve Design System (`@optum-serve/ds`).

---

## Setup

### 1. Install (add to consuming app)

```bash
# In the app that consumes this library, install tailwindcss if not present
npm install tailwindcss @tailwindcss/forms
```

### 2. Import global CSS once (e.g. in `main.tsx` or `App.tsx`)

```tsx
import '@optum-serve/ds/globals.css';
```

### 3. Tailwind config — add the DS source to `content`

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    '../optum-serve-ds/src/**/*.{ts,tsx}',  // adjust path as needed
  ],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/forms')],
};
```

### 4. Import components

```tsx
import { Button, Card, Alert, Badge } from '@optum-serve/ds';
// or for just tokens:
import { colors, spacing, semanticColors } from '@optum-serve/ds/tokens';
```

---

## Brand identity

| Property       | Value                                    |
|----------------|------------------------------------------|
| Primary color  | `#FF612B` — Optum Orange                 |
| Secondary      | `#1A2B4A` — Serve Navy (nav, headers)    |
| Link/info      | `#0067B1` — Federal Blue                 |
| Success        | `#2E7D32`                                |
| Warning        | `#E65100`                                |
| Error          | `#C62828`                                |
| Font           | OptumSans → Helvetica Neue → Arial       |
| Spacing base   | 4px grid                                 |
| Border radius  | 4px inputs/buttons · 8px cards           |
| Focus ring     | `0 0 0 3px rgba(255,97,43,0.25)`         |
| WCAG target    | AA minimum (federal requirement)         |

---

## Component usage

### Button

```tsx
import { Button } from '@optum-serve/ds';

// Variants: primary | secondary | ghost | danger
// Sizes: xs | sm | md | lg | xl

<Button variant="primary" size="md">Save provider</Button>
<Button variant="secondary" loading>Submitting...</Button>
<Button variant="ghost" iconLeft={<Icon />}>Export</Button>
<Button variant="danger" size="sm">Delete</Button>
<Button variant="primary" fullWidth>Continue</Button>
```

### Badge

```tsx
import { Badge } from '@optum-serve/ds';

// Colors: orange | blue | teal | green | amber | red | gray
<Badge color="green" dot>Active</Badge>
<Badge color="blue">In review</Badge>
<Badge color="red">Denied</Badge>
<Badge color="gray">Inactive</Badge>
```

### Card

```tsx
import { Card, CardHeader, CardBody, CardFooter, Badge, Button } from '@optum-serve/ds';

<Card>
  <CardHeader
    sectionNumber="I"
    title="Veteran information"
    subtitle="All required fields marked *"
    badge={<Badge color="orange">Required</Badge>}
  />
  <CardBody>
    {/* form fields */}
  </CardBody>
  <CardFooter>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

### Alert

```tsx
import { Alert } from '@optum-serve/ds';

// status: info | success | warning | error
<Alert status="info" title="Note">
  This form must be submitted via an approved method.
</Alert>

<Alert status="error" onClose={() => setVisible(false)}>
  Unable to process the request. Contact support.
</Alert>
```

### Form fields

```tsx
import { FieldWrapper, Input, Select, Textarea, Checkbox, ChipCheckbox, RadioGroup } from '@optum-serve/ds';

// Labeled input with hint + error
<FieldWrapper label="NPI #" htmlFor="npi" required hint="10-digit identifier" error={errors.npi}>
  <Input id="npi" value={npi} onChange={e => setNpi(e.target.value)} error={!!errors.npi} />
</FieldWrapper>

// Select
<FieldWrapper label="Specialty" htmlFor="spec" required>
  <Select id="spec" value={specialty} onChange={e => setSpecialty(e.target.value)}>
    <option value="">Select...</option>
    <option value="pc">Primary Care</option>
    <option value="bh">Behavioral Health</option>
  </Select>
</FieldWrapper>

// Textarea
<FieldWrapper label="Medical justification" required>
  <Textarea rows={5} value={text} onChange={e => setText(e.target.value)} />
</FieldWrapper>

// Chip multi-select
{services.map(svc => (
  <ChipCheckbox
    key={svc.id}
    label={svc.label}
    checked={selected.includes(svc.id)}
    onChange={c => toggle(svc.id, c)}
  />
))}

// Radio group
<RadioGroup
  name="urgency"
  value={urgency}
  onChange={setUrgency}
  options={[
    { value: 'routine', label: 'Routine', description: 'Standard timeline, 3+ days' },
    { value: 'urgent',  label: 'Urgent',  description: 'Fewer than 3 days' },
  ]}
/>
```

### NavBar

```tsx
import { NavBar, Avatar, Button } from '@optum-serve/ds';

<NavBar
  productName="Optum Serve · Community care"
  links={[
    { label: 'Solutions', href: '/', active: true },
    { label: 'Providers', href: '/providers' },
    { label: 'Resources', href: '/resources' },
  ]}
  actions={
    <>
      <Avatar initials="PN" name="Dr. P. Nguyen" />
      <Button variant="primary" size="sm">Provider portal</Button>
    </>
  }
/>
```

### StepProgress

```tsx
import { StepProgress } from '@optum-serve/ds';

const steps = [
  { label: 'Veteran' },
  { label: 'Provider' },
  { label: 'Services' },
  { label: 'Review' },
];

// theme="dark" → white text on navy background (for header bars)
// theme="light" → dark text on white background (inline use)
<StepProgress steps={steps} currentStep={1} theme="dark" />
```

### Tabs

```tsx
import { Tabs } from '@optum-serve/ds';

const [active, setActive] = useState('buttons');

<Tabs
  tabs={[
    { id: 'buttons',  label: 'Buttons' },
    { id: 'forms',    label: 'Forms' },
    { id: 'data',     label: 'Data', badge: 3 },
    { id: 'disabled', label: 'Disabled', disabled: true },
  ]}
  activeTab={active}
  onChange={setActive}
  aria-label="Component categories"
/>

{/* Tab panels */}
<div role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`}>
  {/* content */}
</div>
```

### Breadcrumb

```tsx
import { Breadcrumb } from '@optum-serve/ds';

<Breadcrumb items={[
  { label: 'Home', href: '/' },
  { label: 'Federal solutions', href: '/solutions' },
  { label: 'Request for services' }, // last item = current, no href
]} />
```

### DataTable

```tsx
import { DataTable, Badge } from '@optum-serve/ds';
import type { Column } from '@optum-serve/ds';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  status: 'active' | 'review' | 'inactive';
  patients: number;
}

const columns: Column<Provider>[] = [
  { key: 'name',      header: 'Provider',   render: r => <strong>{r.name}</strong> },
  { key: 'specialty', header: 'Specialty' },
  {
    key: 'status',
    header: 'Status',
    render: r => (
      <Badge color={r.status === 'active' ? 'green' : r.status === 'review' ? 'blue' : 'gray'}>
        {r.status}
      </Badge>
    ),
  },
  { key: 'patients', header: 'Patients', align: 'right' },
];

<DataTable
  columns={columns}
  data={providers}
  rowKey="id"
  onRowClick={row => navigate(`/providers/${row.id}`)}
  caption="Provider roster"
/>
```

### StatCard

```tsx
import { StatCard } from '@optum-serve/ds';

<StatCard
  label="Claim accuracy"
  value="98.4%"
  change={{ value: '+0.2%', positive: true }}
/>
```

### ProgressBar

```tsx
import { ProgressBar } from '@optum-serve/ds';

<ProgressBar value={78} label="Enrollment completion" color="orange" />
<ProgressBar value={45} label="Claim processing"      color="blue" />
<ProgressBar value={100}label="Verification"          color="green" />
```

### Modal

```tsx
import { Modal, Button } from '@optum-serve/ds';
import { useDisclosure } from '@optum-serve/ds';

function Example() {
  const modal = useDisclosure();
  return (
    <>
      <Button onClick={modal.open}>Open</Button>
      <Modal
        open={modal.isOpen}
        onClose={modal.close}
        title="Confirm submission"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={modal.close}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Submit request</Button>
          </>
        }
      >
        <p>Are you sure you want to submit this RFS?</p>
      </Modal>
    </>
  );
}
```

### Toast

```tsx
import { Toast, ToastContainer } from '@optum-serve/ds';
import { useToast } from '@optum-serve/ds';

function App() {
  const toast = useToast();
  return (
    <>
      <Button onClick={() => toast.success('Claim approved')}>Approve</Button>
      <Button onClick={() => toast.error('Submission failed')}>Submit</Button>

      <ToastContainer>
        {toast.toasts.map(t => (
          <Toast key={t.id} {...t} onDismiss={toast.dismissToast} />
        ))}
      </ToastContainer>
    </>
  );
}
```

---

## Hooks

| Hook              | Purpose                                    |
|-------------------|--------------------------------------------|
| `useToast()`      | Add/dismiss toasts with `success/error/warning/info` helpers |
| `useMultiStep()`  | currentStep, next, prev, goTo, isFirst, isLast, progress |
| `useDisclosure()` | isOpen, open, close, toggle for modals/drawers |
| `useLocalStorage()` | Typed localStorage with React state sync |
| `useDebounce()`   | Debounce a value by N ms                  |
| `usePrevious()`   | Returns the previous render's value       |

---

## CSS variables

All design tokens are available as CSS custom properties after importing `globals.css`:

```css
/* Colors */
--os-orange-500   /* #FF612B — primary CTA */
--os-navy-600     /* #1A2B4A — nav bg */
--os-blue-500     /* #0067B1 — links, info */
--os-green-500    /* #2E7D32 */
--os-red-500      /* #C62828 */

/* Semantic */
--os-color-action        /* var(--os-orange-500) */
--os-color-action-hover  /* var(--os-orange-700) */
--os-color-action-light  /* var(--os-orange-50) */
--os-color-link          /* var(--os-blue-500) */
--os-color-success       /* var(--os-green-500) */
--os-color-error         /* var(--os-red-500) */
--os-text-primary        /* var(--os-gray-900) */
--os-text-secondary      /* var(--os-gray-600) */
--os-bg-page             /* var(--os-gray-50) */
--os-bg-card             /* var(--os-gray-0) = white */
--os-border-default      /* var(--os-gray-300) */
--os-border-focus        /* var(--os-orange-500) */

/* Spacing */
--os-space-1  /* 4px  */  --os-space-2  /* 8px  */
--os-space-3  /* 12px */  --os-space-4  /* 16px */
--os-space-6  /* 24px */  --os-space-8  /* 32px */

/* Radii */
--os-radius-sm  /* 4px  */  --os-radius-md /* 8px  */
--os-radius-lg  /* 12px */  --os-radius-pill /* 9999px */

/* Shadows */
--os-shadow-focus  /* orange focus ring */
```

---

## Accessibility requirements

Optum Serve serves federal programs. Every UI must meet WCAG 2.1 AA:

- All interactive elements must be keyboard-navigable with visible focus (`focus-visible`).
- All form inputs require associated `<label>` elements (use `FieldWrapper`).
- All images need `alt` attributes; decorative images use `alt=""` + `aria-hidden="true"`.
- Error messages must be announced via `role="alert"` (built into `Alert` and `FieldWrapper`).
- Color alone cannot convey meaning — always pair with text or icon.
- Use `aria-live="polite"` for dynamic content updates.
- Orange on white (`#FF612B` on `#FFF`) = 3.06:1 contrast. **Only use for large text (18px+) or non-text elements.** For body text, use `#CC4D22` or darker.
- Navy (`#1A2B4A`) on white = 14.8:1 ✓. Blue (`#0067B1`) on white = 4.64:1 ✓.

---

## Voice & tone rules

When generating copy for UI labels, errors, empty states, and notifications:

- **Sentence case always.** "Add a provider" not "Add A Provider".
- **Active voice.** "Save changes" not "Changes will be saved".
- **Plain language.** 8th-grade reading level. No jargon.
- **Specific errors.** "Enter a 10-digit NPI number. Example: 1234567890." not "Invalid input."
- **Human-centered.** "Find a provider near you" not "Utilize our provider search functionality."
- **AP Style.** Spell out numbers one through nine; use numerals for 10+.

---

## File structure

```
optum-serve-ds/
├── CLAUDE.md                 ← You are here
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              ← Public barrel export
    ├── tokens/
    │   ├── index.ts          ← JS token objects
    │   └── globals.css       ← CSS custom properties
    ├── types/
    │   └── index.ts          ← Shared TypeScript types
    ├── utils/
    │   └── cn.ts             ← className merger
    ├── hooks/
    │   └── index.ts          ← useToast, useMultiStep, useDisclosure, etc.
    └── components/
        ├── ui/
        │   ├── Button.tsx
        │   ├── Badge.tsx
        │   ├── Card.tsx
        │   └── DataDisplay.tsx  ← StatCard, ProgressBar, DataTable, Divider
        ├── form/
        │   └── FormField.tsx    ← FieldWrapper, Input, Select, Textarea, Checkbox, etc.
        ├── layout/
        │   ├── NavBar.tsx       ← NavBar, Avatar
        │   └── Navigation.tsx   ← StepProgress, Breadcrumb, Tabs
        └── feedback/
            ├── Alert.tsx
            └── Overlays.tsx     ← Modal, Toast, ToastContainer
```
