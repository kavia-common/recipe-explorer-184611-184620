export const colors = {
  primary: '#2563EB',
  secondary: '#F59E0B', // used for success/accents
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  chipBg: '#EEF2FF',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
};

export const shadows = {
  // Subtle shadow for iOS and fallback elevation for Android
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

export const typography = {
  title: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.muted,
  },
  body: {
    fontSize: 14,
    color: colors.text,
  },
};

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  typography: typeof typography;
};

export const theme: Theme = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
};
