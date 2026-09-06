/**
 * Koda design tokens — a warm, editorial "ink & brass" system.
 * Centralized so every screen shares the same aesthetic and can be re-themed in one place.
 */

export const Palette = {
  ink: '#0F1A22',
  navy: '#182633',
  navyLight: '#24394A',
  slate: '#2C4051',
  brass: '#C9A268',
  brassDeep: '#A87C41',
  brassSoft: '#E7D3AE',
  clay: '#8A6B49',
  sand: '#E4D8C4',
  sandLight: '#F2EBDE',
  paper: '#FBF8F3',
  surface: '#FFFFFF',
  ash: '#767F87',
  ash2: '#9CA3A8',
  hairline: '#E9E2D4',
  hairlineSoft: '#F1ECE2',
  harbor: '#52708A',
  moss: '#5C7A62',
  rust: '#96776B',
} as const;

export const Gradients = {
  hero: ['#0F1A22', '#28414F'] as [string, string],
  brass: ['#DEBC85', '#A87C41'] as [string, string],
  moss: ['#82A088', '#4C6B52'] as [string, string],
  paperGlow: ['#FFFDF9', '#F2EBDE'] as [string, string],
};

export const Radius = { xs: 8, sm: 14, md: 20, lg: 26, xl: 32, pill: 999 } as const;

export const Shadow = {
  soft: {
    shadowColor: '#101A22',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  lifted: {
    shadowColor: '#0F1A22',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
  glow: {
    shadowColor: '#A87C41',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

export const Type = {
  display: 34,
  h1: 25,
  h2: 19,
  h3: 15.5,
  body: 13.5,
  caption: 11.5,
  micro: 10,
} as const;

export const Easing = {
  quick: 180,
  base: 260,
  slow: 420,
} as const;
