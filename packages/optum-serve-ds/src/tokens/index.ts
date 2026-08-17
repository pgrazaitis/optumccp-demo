// ─────────────────────────────────────────────
//  Optum Serve Design System — Design Tokens
//  Based on publicly available Optum brand standards
// ─────────────────────────────────────────────

export const colors = {
  // ── Brand ──────────────────────────────────
  orange: {
    50:  '#FFF0EB',
    100: '#FFD5C5',
    200: '#FFB09A',
    300: '#FF8A6B',
    400: '#FF6F47',
    500: '#FF612B', // Primary brand orange
    600: '#E8501C',
    700: '#CC4D22', // Hover / dark
    800: '#A63E1A',
    900: '#7A2D0F',
  },

  // ── Federal / Government ───────────────────
  navy: {
    50:  '#E8EBF0',
    100: '#C5CDD9',
    200: '#9CAEC0',
    300: '#738EA7',
    400: '#4D7293',
    500: '#2D4068',
    600: '#1A2B4A', // Primary navy — nav, headers
    700: '#142239',
    800: '#0E1928',
    900: '#080F18',
  },

  blue: {
    50:  '#E6F2FA',
    100: '#B5D4F4',
    200: '#85B7EB',
    300: '#4F96DE',
    400: '#2478CC',
    500: '#0067B1', // Federal blue — links, info
    600: '#0057961',
    700: '#004780',
    800: '#003768',
    900: '#002550',
  },

  // ── Extended palette ──────────────────────
  teal: {
    50:  '#E0F5F4',
    500: '#00837A',
    700: '#005C56',
  },

  green: {
    50:  '#EDF7EE',
    500: '#2E7D32',
    700: '#1B5E20',
  },

  amber: {
    50:  '#FFF3E0',
    500: '#E65100',
    700: '#BF360C',
  },

  red: {
    50:  '#FEECEC',
    500: '#C62828',
    700: '#B71C1C',
  },

  // ── Neutrals ──────────────────────────────
  gray: {
    0:   '#FFFFFF',
    50:  '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#ADB5BD',
    500: '#868E96',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
} as const;

// ── Semantic color aliases ──────────────────
export const semanticColors = {
  // Actions
  action:          colors.orange[500],
  actionHover:     colors.orange[700],
  actionLight:     colors.orange[50],
  actionDark:      colors.orange[800],

  // Links / info
  link:            colors.blue[500],
  linkHover:       colors.blue[700],
  info:            colors.blue[500],
  infoLight:       colors.blue[50],

  // Navigation / headers
  navBg:           colors.navy[600],
  navBgMid:        colors.navy[500],

  // Status
  success:         colors.green[500],
  successLight:    colors.green[50],
  warning:         colors.amber[500],
  warningLight:    colors.amber[50],
  error:           colors.red[500],
  errorLight:      colors.red[50],

  // Text
  textPrimary:     colors.gray[900],
  textSecondary:   colors.gray[600],
  textTertiary:    colors.gray[400],
  textInverse:     '#FFFFFF',

  // Surfaces
  bgPage:          colors.gray[50],
  bgCard:          colors.gray[0],
  bgSecondary:     colors.gray[100],

  // Borders
  borderDefault:   colors.gray[300],
  borderFocus:     colors.orange[500],
  borderSubtle:    colors.gray[200],
} as const;

// ── Typography ────────────────────────────
export const typography = {
  fontFamily: {
    // OptumSans is Optum's proprietary typeface; fall back to system stack
    sans:  "'OptumSans', 'Helvetica Neue', Arial, sans-serif",
    mono:  "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
    serif: "Georgia, 'Times New Roman', serif",
  },

  // Major Second scale (ratio 1.125) with 16px base
  fontSize: {
    '2xs': '0.694rem', //  ~11px
    xs:    '0.778rem', //  ~12.5px
    sm:    '0.875rem', //  14px
    md:    '1rem',     //  16px — base
    lg:    '1.125rem', //  18px
    xl:    '1.266rem', //  ~20px
    '2xl': '1.424rem', //  ~22.8px
    '3xl': '1.602rem', //  ~25.6px
    '4xl': '1.802rem', //  ~28.8px
    '5xl': '2.027rem', //  ~32.4px
    '6xl': '2.281rem', //  ~36.5px
    '7xl': '2.566rem', //  ~41px
  },

  fontWeight: {
    regular: 400,
    medium:  500,
  },

  lineHeight: {
    tight:   1.25,
    snug:    1.4,
    normal:  1.5,
    relaxed: 1.6,
    loose:   1.75,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight:   '-0.025em',
    normal:  '0em',
    wide:    '0.025em',
    wider:   '0.05em',
    widest:  '0.1em',
  },
} as const;

// ── Type roles (semantic aliases) ─────────
export const typeRoles = {
  display: {
    fontSize:      typography.fontSize['7xl'],
    fontWeight:    typography.fontWeight.medium,
    lineHeight:    typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tighter,
  },
  h1: {
    fontSize:      typography.fontSize['5xl'],
    fontWeight:    typography.fontWeight.medium,
    lineHeight:    typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize:      typography.fontSize['3xl'],
    fontWeight:    typography.fontWeight.medium,
    lineHeight:    typography.lineHeight.snug,
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize:      typography.fontSize['2xl'],
    fontWeight:    typography.fontWeight.medium,
    lineHeight:    typography.lineHeight.snug,
  },
  h4: {
    fontSize:      typography.fontSize.xl,
    fontWeight:    typography.fontWeight.medium,
    lineHeight:    typography.lineHeight.normal,
  },
  body: {
    fontSize:      typography.fontSize.md,
    fontWeight:    typography.fontWeight.regular,
    lineHeight:    typography.lineHeight.relaxed,
  },
  bodySmall: {
    fontSize:      typography.fontSize.sm,
    fontWeight:    typography.fontWeight.regular,
    lineHeight:    typography.lineHeight.relaxed,
  },
  label: {
    fontSize:      typography.fontSize.sm,
    fontWeight:    typography.fontWeight.medium,
    lineHeight:    typography.lineHeight.normal,
  },
  caption: {
    fontSize:      typography.fontSize.xs,
    fontWeight:    typography.fontWeight.regular,
    lineHeight:    typography.lineHeight.normal,
  },
  eyebrow: {
    fontSize:      typography.fontSize['2xs'],
    fontWeight:    typography.fontWeight.medium,
    lineHeight:    typography.lineHeight.normal,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
  code: {
    fontSize:      typography.fontSize.sm,
    fontWeight:    typography.fontWeight.regular,
    lineHeight:    typography.lineHeight.relaxed,
    fontFamily:    typography.fontFamily.mono,
  },
} as const;

// ── Spacing ──────────────────────────────
// 4px base grid; all values are multiples of 4
export const spacing = {
  0:    '0px',
  px:   '1px',
  0.5:  '2px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  7:    '28px',
  8:    '32px',
  9:    '36px',
  10:   '40px',
  12:   '48px',
  14:   '56px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  32:   '128px',
} as const;

// ── Border radius ─────────────────────────
export const borderRadius = {
  none:  '0px',
  xs:    '2px',
  sm:    '4px',    // inputs, buttons
  md:    '8px',    // cards, panels
  lg:    '12px',   // modals, large cards
  xl:    '16px',
  '2xl': '24px',
  pill:  '9999px', // badges, chips
} as const;

// ── Box shadows ────────────────────────────
export const shadows = {
  none:  'none',
  xs:    '0 1px 2px rgba(0,0,0,0.05)',
  sm:    '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  md:    '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
  lg:    '0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.05)',
  xl:    '0 20px 25px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.04)',
  focus: '0 0 0 3px rgba(255, 97, 43, 0.25)', // orange focus ring
  focusError: '0 0 0 3px rgba(198, 40, 40, 0.2)',
} as const;

// ── Breakpoints ────────────────────────────
export const breakpoints = {
  xs:  '375px',
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const;

// ── Z-index ────────────────────────────────
export const zIndex = {
  hide:    -1,
  base:     0,
  raised:   1,
  dropdown: 100,
  sticky:   200,
  overlay:  300,
  modal:    400,
  toast:    500,
  tooltip:  600,
} as const;

// ── Transitions ────────────────────────────
export const transitions = {
  fast:   '100ms ease',
  normal: '150ms ease',
  slow:   '250ms ease',
  spring: '200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ── Grid ───────────────────────────────────
export const grid = {
  desktop: {
    columns: 12,
    gutter:  '24px',
    margin:  '40px',
    maxWidth: '1280px',
  },
  tablet: {
    columns: 8,
    gutter:  '16px',
    margin:  '24px',
  },
  mobile: {
    columns: 4,
    gutter:  '12px',
    margin:  '16px',
  },
} as const;
