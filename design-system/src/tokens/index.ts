export * from "./brand";

/**
 * Clean-sheet immutable token references from /tokens/primitives.json
 */
export const neutral = {
  n0: "#FFFFFF",
  n25: "#FCFCFC",
  n50: "#F7F7F7",
  n100: "#F2F2F2",
  n150: "#EAEAEA",
  n200: "#E0E0E0",
  n300: "#C4C4C4",
  n400: "#959595",
  n500: "#6A6A6A",
  n600: "#525252",
  n700: "#383838",
  n800: "#252525",
  n900: "#161616",
  n950: "#0A0A0A",
} as const;

export const status = {
  success: "#12744B",
  successBackground: "#EAF7F0",
  successBorder: "#A3D9BD",
  warning: "#8B5D08",
  warningBackground: "#FFF6E5",
  warningBorder: "#F5D699",
  danger: "#B42318",
  dangerBackground: "#FFF1EF",
  dangerBorder: "#FECDCA",
  info: "#225CB0",
  infoBackground: "#EDF4FF",
  infoBorder: "#BFDBFE",
  focus: "#2359CE",
} as const;

export const brandAssets = {
  origin: "https://zackisch.com",
  symbol: "https://zackisch.com/brand_mark.svg",
  wordmark: "https://zackisch.com/word_mark.svg",
  combination: "https://zackisch.com/combination_mark.svg",
  og: "https://zackisch.com/og_image.png",
  appleTouchIcon: "https://zackisch.com/apple-touch-icon.png",
} as const;

export const touch = {
  min: 44,
  staff: 48,
} as const;

/**
 * Core primitive color tokens (Zackisch Monochrome Design System)
 * Strictly monochrome (neutral scale) with functional status colors.
 */
export const CORE_COLORS = {
  ink: neutral.n900, // #161616
  inkStrong: neutral.n950, // #0A0A0A
  muted: neutral.n600, // #525252
  subtle: neutral.n500, // #6A6A6A
  canvas: neutral.n50, // #F7F7F7
  canvasPublic: neutral.n0, // #FFFFFF
  paper: neutral.n0, // #FFFFFF
  line: neutral.n300, // #C4C4C4
  lineLight: neutral.n200, // #E0E0E0
  lineStrong: neutral.n800, // #252525
  charcoal: neutral.n900,
  warmPaper: "#F5F3F0",
  warmLine: "#E9E6E2",
  success: status.success,
  successBg: status.successBackground,
  warning: status.warning,
  warningBg: status.warningBackground,
  danger: status.danger,
  dangerBg: status.dangerBackground,
  info: status.info,
  infoBg: status.infoBackground,
  focus: status.focus,
} as const;

/**
 * Semantic tokens mapped to functional UI roles
 */
export const SEMANTIC_TOKENS = {
  surface: {
    page: CORE_COLORS.canvas,
    public: CORE_COLORS.canvasPublic,
    card: CORE_COLORS.paper,
    raised: CORE_COLORS.paper,
    muted: neutral.n100,
    inverse: neutral.n900,
    editorial: CORE_COLORS.warmPaper,
  },
  text: {
    primary: neutral.n900,
    strong: neutral.n950,
    secondary: neutral.n600,
    muted: neutral.n500,
    inverse: neutral.n0,
    link: neutral.n900,
  },
  border: {
    default: neutral.n300,
    subtle: neutral.n200,
    strong: neutral.n800,
  },
  action: {
    primaryBg: neutral.n900,
    primaryHoverBg: neutral.n800,
    primaryPressedBg: neutral.n950,
    primaryText: neutral.n0,
    secondaryBg: neutral.n0,
    secondaryBorder: neutral.n300,
    secondaryText: neutral.n900,
    ghostHoverBg: neutral.n100,
    destructiveBg: status.danger,
    destructiveHoverBg: "#982016",
    destructiveText: neutral.n0,
    focusRing: status.focus,
  },
  status: {
    positive: {
      text: status.success,
      bg: status.successBackground,
      border: status.successBorder,
    },
    attention: {
      text: status.warning,
      bg: status.warningBackground,
      border: status.warningBorder,
    },
    negative: {
      text: status.danger,
      bg: status.dangerBackground,
      border: status.dangerBorder,
    },
    info: {
      text: status.info,
      bg: status.infoBackground,
      border: status.infoBorder,
    },
  },
} as const;

/**
 * Typography Tokens
 * Poppins is the principal brand and UI font.
 * Inter / system-ui is for high-density tabular numbers.
 */
export const TYPOGRAPHY_TOKENS = {
  fontBrand: "var(--font-poppins-variable, Poppins), system-ui, -apple-system, sans-serif",
  fontUi: "var(--font-poppins-variable, Poppins), system-ui, -apple-system, sans-serif",
  fontNumeric: "var(--font-inter-variable, Inter), var(--font-poppins-variable, Poppins), tabular-nums, sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
  },
  lineHeights: {
    tight: 1.15,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

/**
 * Touch target & layout increments
 */
export const LAYOUT_TOKENS = {
  spacingBase: 4,
  touchTargetMin: "44px",
  touchTargetComfort: "48px",
  radii: {
    none: "0px",
    sm: "6px",
    md: "10px",
    lg: "12px",
    xl: "16px",
    "2xl": "20px",
    full: "9999px",
  },
  maxWidths: {
    marketing: "1280px",
    article: "72ch",
    dashboard: "1600px",
    modal: "540px",
  },
} as const;
