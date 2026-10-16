export * from "./brand";

/**
 * Core primitive color tokens
 * Hospitality warmth palette designed for readability and WCAG 2.2 AA compliance
 */
export const CORE_COLORS = {
  ink: "#192C25",
  deepForest: "#173C2B",
  forestHover: "#245740",
  forestMuted: "#DCEFE5",
  cream: "#F7F5EF",
  paper: "#FFFFFF",
  charcoal: "#1A2721",
  subtle: "#53665B",
  line: "#D6DED7",
  lineLight: "#E8EFE9",
  success: "#17643B",
  successBg: "#EBF7EE",
  warning: "#885200",
  warningBg: "#FFF7EB",
  danger: "#B42318",
  dangerBg: "#FEF3F2",
  focus: "#1E66B5",
} as const;

/**
 * Semantic tokens mapped to functional UI roles
 */
export const SEMANTIC_TOKENS = {
  surface: {
    page: CORE_COLORS.cream,
    card: CORE_COLORS.paper,
    raised: CORE_COLORS.paper,
    muted: "#F0EFEA",
    highlight: CORE_COLORS.forestMuted,
  },
  text: {
    primary: CORE_COLORS.charcoal,
    secondary: CORE_COLORS.subtle,
    brand: CORE_COLORS.deepForest,
    inverse: "#FFFFFF",
    onBrand: "#FFFFFF",
  },
  border: {
    default: CORE_COLORS.line,
    subtle: CORE_COLORS.lineLight,
    strong: CORE_COLORS.subtle,
    brand: CORE_COLORS.deepForest,
  },
  action: {
    primaryBg: CORE_COLORS.deepForest,
    primaryHoverBg: CORE_COLORS.forestHover,
    primaryText: "#FFFFFF",
    secondaryBg: CORE_COLORS.paper,
    secondaryBorder: CORE_COLORS.line,
    secondaryText: CORE_COLORS.charcoal,
    destructiveBg: CORE_COLORS.danger,
    destructiveText: "#FFFFFF",
    focusRing: CORE_COLORS.focus,
  },
  status: {
    positive: {
      text: CORE_COLORS.success,
      bg: CORE_COLORS.successBg,
      border: "#A6D5B8",
    },
    attention: {
      text: CORE_COLORS.warning,
      bg: CORE_COLORS.warningBg,
      border: "#F5D699",
    },
    negative: {
      text: CORE_COLORS.danger,
      bg: CORE_COLORS.dangerBg,
      border: "#FECDCA",
    },
    info: {
      text: CORE_COLORS.deepForest,
      bg: CORE_COLORS.forestMuted,
      border: "#B2DEC8",
    },
  },
} as const;

/**
 * Typography Tokens
 * Poppins is the non-negotiable principal brand font.
 * Inter / system-ui is optional for high-density tabular numbers.
 */
export const TYPOGRAPHY_TOKENS = {
  fontBrand: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontUi: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontNumeric: "var(--font-poppins, Poppins), tabular-nums",
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
 * Touch target & layout increments (4px base)
 */
export const LAYOUT_TOKENS = {
  spacingBase: 4,
  touchTargetMin: "44px",
  touchTargetComfort: "48px",
  radii: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.25rem", // 20px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },
  maxWidths: {
    marketing: "1280px",
    article: "768px",
    dashboard: "1440px",
    modal: "540px",
  },
} as const;
