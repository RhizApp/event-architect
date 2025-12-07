export type HeroTheme = 'professional' | 'vibrant' | 'luxury';

export interface ThemeConfig {
  typography: {
    title: string;
    subtitle: string;
    meta: string;
  };
  colors: {
    background: string;
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    button: {
      bg: string;
      text: string;
    };
  };
  gradients: {
    base: string; // The intricate radial/conic base
    overlay: string; // For the veil over images
    text?: string;
  };
  patterns: {
    type: 'grid' | 'waveform' | 'tessellation';
  };
}

export const THEMES: Record<HeroTheme, ThemeConfig> = {
  professional: {
    typography: {
      // Condensed, high-clarity, editorial (Söhne/Roboto Condensed-like)
      title: 'font-family: "Roboto Condensed", "Arial Narrow", sans-serif; letter-spacing: -0.02em; font-weight: 700;',
      // Wide sans
      subtitle: 'font-family: system-ui, -apple-system, sans-serif; letter-spacing: 0.01em; font-weight: 400;',
      // Mono/Semi-mono
      meta: 'font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.05em;',
    },
    colors: {
      background: '#0a0e14', // Deep slate/midnight
      text: {
        primary: '#ffffff',
        secondary: '#94a3b8',
        accent: '#38bdf8', // Electric blue pinlight
      },
      button: {
        bg: '#ffffff',
        text: '#0f172a',
      },
    },
    gradients: {
      // Deep slate -> midnight navy -> electric blue pinlights
      base: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 60%, #020617 100%)',
      overlay: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(2, 6, 23, 0.8))',
    },
    patterns: {
      type: 'grid', // Angled line fields
    },
  },
  vibrant: {
    typography: {
      // Expressive wide sans / Geometric display
      title: 'font-family: "Outfit", "Avant Garde", "Century Gothic", sans-serif; letter-spacing: -0.01em; font-weight: 800;',
      // Lighter, extended sans
      subtitle: 'font-family: system-ui, sans-serif; letter-spacing: 0.02em; font-weight: 300;',
      // Clean, minimal sans
      meta: 'font-family: system-ui, sans-serif; font-weight: 600; letter-spacing: 0.05em;',
    },
    colors: {
      background: '#2e0225', // Deep purple based
      text: {
        primary: '#ffffff',
        secondary: '#fbcfe8',
        accent: '#f472b6',
      },
      button: {
        bg: '#f0f9ff', // Very light, high contrast
        text: '#db2777',
      },
    },
    gradients: {
      // Magenta -> Citrus Peach -> Rich Violet pulses
      base: 'radial-gradient(circle at 60% 30%, #be185d 0%, #701a75 50%, #4a044e 100%)',
      overlay: 'linear-gradient(45deg, rgba(190, 24, 93, 0.3), rgba(74, 4, 78, 0.6))',
    },
    patterns: {
      type: 'waveform', // Flowing ribbons
    },
  },
  luxury: {
    typography: {
      // High-contrast serif / Ultra-polished display
      title: 'font-family: "Playfair Display", "Didot", "Times New Roman", serif; letter-spacing: -0.01em; font-weight: 600; font-style: italic;',
      // Muted serif / Thin sans
      subtitle: 'font-family: "Helvetica Neue", sans-serif; font-weight: 200; letter-spacing: 0.05em;',
      // Micro-serif / Metallic small caps
      meta: 'font-family: "Times New Roman", serif; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.2em;',
    },
    colors: {
      background: '#1c1917', // Obsidian/Warm black
      text: {
        primary: '#fafaf9', // Stone 50
        secondary: '#a8a29e', // Stone 400
        accent: '#d4af37', // Gold
      },
      button: {
        bg: '#d4af37', // Gold
        text: '#1c1917',
      },
    },
    gradients: {
      // Obsidian -> Brushed Gold -> Soft Champagne Haze
      base: 'radial-gradient(ellipse at top, #44403c 0%, #1c1917 50%, #0c0a09 100%)',
      overlay: 'linear-gradient(to bottom, rgba(28, 25, 23, 0.5), rgba(0, 0, 0, 0.8))',
    },
    patterns: {
      type: 'tessellation', // Geometric
    },
  },
};
