export const theme = {
  colors: {
    primary: '#d20a0a',      // rojo UFC
    primaryDark: '#a00808',
    secondary: '#1f2937',
    background: '#f3f4f6',
    surface: '#ffffff',
    sidebar: '#111827',
    text: '#111827',
    textLight: '#6b7280',
    textOnDark: '#f9fafb',
    border: '#e5e7eb',
    danger: '#dc2626',
    success: '#16a34a',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    round: '50%',
  },
} as const;

export type AppTheme = typeof theme;