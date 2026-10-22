/**
 * Catppuccin Official Color Palettes & BBeBee Token Mappings.
 *
 * Provides accurate color palettes for all 4 flavours:
 * - Mocha (dark)
 * - Macchiato (dark)
 * - Frappé (dark)
 * - Latte (light)
 *
 * Reference: https://github.com/catppuccin/catppuccin (v1.8.0)
 */

export type CatppuccinFlavorId = 'latte' | 'frappe' | 'macchiato' | 'mocha'
export type CatppuccinAccent = 'mauve' | 'blue' | 'lavender' | 'pink' | 'peach' | 'green' | 'teal'

export interface CatppuccinPalette {
  rosewater: string
  flamingo: string
  pink: string
  mauve: string
  red: string
  maroon: string
  peach: string
  yellow: string
  green: string
  teal: string
  sky: string
  sapphire: string
  blue: string
  lavender: string
  text: string
  subtext1: string
  subtext0: string
  overlay2: string
  overlay1: string
  overlay0: string
  surface2: string
  surface1: string
  surface0: string
  base: string
  mantle: string
  crust: string
}

export const CATPPUCCIN_RAW_PALETTES: Record<CatppuccinFlavorId, CatppuccinPalette> = {
  latte: {
    rosewater: '#dc8a78',
    flamingo: '#dd7878',
    pink: '#ea76cb',
    mauve: '#8839ef',
    red: '#d20f39',
    maroon: '#e64553',
    peach: '#fe640b',
    yellow: '#df8e1d',
    green: '#40a02b',
    teal: '#179299',
    sky: '#04a5e5',
    sapphire: '#209fb5',
    blue: '#1e66f5',
    lavender: '#7287fd',
    text: '#4c4f69',
    subtext1: '#5c5f77',
    subtext0: '#6c6f85',
    overlay2: '#7c7f93',
    overlay1: '#8c8fa1',
    overlay0: '#9ca0b0',
    surface2: '#acb0be',
    surface1: '#bcc0cc',
    surface0: '#ccd0da',
    base: '#eff1f5',
    mantle: '#e6e9ef',
    crust: '#dce0e8',
  },
  frappe: {
    rosewater: '#f2d5cf',
    flamingo: '#eebebe',
    pink: '#f4b8e4',
    mauve: '#ca9ee6',
    red: '#e78284',
    maroon: '#ea999c',
    peach: '#ef9f76',
    yellow: '#e5c890',
    green: '#a6d189',
    teal: '#81c8be',
    sky: '#99d1db',
    sapphire: '#85c1dc',
    blue: '#8caaee',
    lavender: '#babbf1',
    text: '#c6d0f5',
    subtext1: '#b5bfe2',
    subtext0: '#a5adce',
    overlay2: '#949cbb',
    overlay1: '#838ba7',
    overlay0: '#737994',
    surface2: '#626880',
    surface1: '#51576d',
    surface0: '#414559',
    base: '#303446',
    mantle: '#292c3c',
    crust: '#232634',
  },
  macchiato: {
    rosewater: '#f4dbd6',
    flamingo: '#f0c6c6',
    pink: '#f5bde6',
    mauve: '#c6a0f6',
    red: '#ed8796',
    maroon: '#ee99a0',
    peach: '#f5a97f',
    yellow: '#eed49f',
    green: '#a6da95',
    teal: '#8bd5ca',
    sky: '#91d7e3',
    sapphire: '#7dc4e4',
    blue: '#8aadf4',
    lavender: '#b7bdf8',
    text: '#cad3f5',
    subtext1: '#b8c0e0',
    subtext0: '#a5adcb',
    overlay2: '#939ab7',
    overlay1: '#8087a2',
    overlay0: '#6e738d',
    surface2: '#5b6078',
    surface1: '#494d64',
    surface0: '#363a4f',
    base: '#24273a',
    mantle: '#1e2030',
    crust: '#181926',
  },
  mocha: {
    rosewater: '#f5e0dc',
    flamingo: '#f2cdcd',
    pink: '#f5c2e7',
    mauve: '#cba6f7',
    red: '#f38ba8',
    maroon: '#eba0ac',
    peach: '#fab387',
    yellow: '#f9e2af',
    green: '#a6e3a1',
    teal: '#94e2d5',
    sky: '#89dceb',
    sapphire: '#74c7ec',
    blue: '#89b4fa',
    lavender: '#b4befe',
    text: '#cdd6f4',
    subtext1: '#bac2de',
    subtext0: '#a6adc8',
    overlay2: '#9399b2',
    overlay1: '#7f849c',
    overlay0: '#6c7086',
    surface2: '#585b70',
    surface1: '#45475a',
    surface0: '#313244',
    base: '#1e1e2e',
    mantle: '#181825',
    crust: '#11111b',
  },
}

export interface FlavorMeta {
  id: string
  flavor: CatppuccinFlavorId
  name: string
  emoji: string
  isDark: boolean
  defaultAccent: CatppuccinAccent
}

export const CATPPUCCIN_FLAVORS: Record<CatppuccinFlavorId, FlavorMeta> = {
  mocha: {
    id: 'catppuccin-mocha',
    flavor: 'mocha',
    name: 'Catppuccin Mocha',
    emoji: '🍫',
    isDark: true,
    defaultAccent: 'mauve',
  },
  macchiato: {
    id: 'catppuccin-macchiato',
    flavor: 'macchiato',
    name: 'Catppuccin Macchiato',
    emoji: '🍵',
    isDark: true,
    defaultAccent: 'mauve',
  },
  frappe: {
    id: 'catppuccin-frappe',
    flavor: 'frappe',
    name: 'Catppuccin Frappé',
    emoji: '🍧',
    isDark: true,
    defaultAccent: 'mauve',
  },
  latte: {
    id: 'catppuccin-latte',
    flavor: 'latte',
    name: 'Catppuccin Latte',
    emoji: '☕',
    isDark: false,
    defaultAccent: 'blue',
  },
}

export function buildBBeBeeTokens(
  flavor: CatppuccinFlavorId,
  accentName?: CatppuccinAccent,
) {
  const p = CATPPUCCIN_RAW_PALETTES[flavor]
  const isDark = flavor !== 'latte'
  const accent = p[accentName || (isDark ? 'mauve' : 'blue')]
  const secondaryAccent = p[accentName === 'lavender' ? 'mauve' : 'lavender']

  if (isDark) {
    return {
      bg: {
        app: p.crust,          // sunken chassis: #11111b (mocha)
        primary: p.base,       // main canvas: #1e1e2e (mocha)
        secondary: p.mantle,   // card background: #181825 (mocha)
        tertiary: p.surface0,  // elevated surface: #313244 (mocha)
      },
      surface: {
        s1: p.surface0,
        s2: p.surface1,
        s3: p.surface2,
        hover: `${p.text}14`,  // text with ~8% alpha
        active: `${p.text}22`, // text with ~13% alpha
        selected: `${accent}28`, // accent with ~16% alpha
      },
      brand: {
        primary: accent,
        primaryActive: p.blue,
        primaryHover: secondaryAccent,
        accent: secondaryAccent,
        accentHover: p.pink,
      },
      gradient: {
        brand: `linear-gradient(135deg, ${p.blue} 0%, ${secondaryAccent} 50%, ${accent} 100%)`,
        progress: `linear-gradient(90deg, ${p.blue} 0%, ${secondaryAccent} 50%, ${accent} 100%)`,
        blueViolet: `linear-gradient(135deg, ${p.blue} 0%, ${accent} 100%)`,
        ice: `linear-gradient(135deg, ${p.text} 0%, ${secondaryAccent} 50%, ${p.blue} 100%)`,
        spectrum: `linear-gradient(90deg, ${p.red} 0%, ${p.peach} 20%, ${p.yellow} 40%, ${p.green} 60%, ${p.blue} 80%, ${p.mauve} 100%)`,
      },
      text: {
        primary: p.text,
        secondary: p.subtext0,
        tertiary: p.subtext1,
        muted: p.overlay1,
        disabled: p.overlay0,
        placeholder: p.overlay0,
      },
      border: {
        subtle: `${p.text}18`,
        default: `${p.text}28`,
        hover: `${accent}66`,
        active: accent,
        focus: `${accent}88`,
      },
      semantic: {
        success: p.green,
        warning: p.yellow,
        error: p.red,
        info: p.blue,
      },
      music: {
        playing: p.green,
        lyrics: p.subtext0,
        lyricsActive: accent,
        lyricsHighlight: p.text,
        waveform: `${p.text}33`,
        waveformActive: accent,
      },
      glow: {
        xs: `0 0 6px ${accent}26`,
        sm: `0 0 12px ${accent}33`,
        md: `0 0 24px ${accent}40`,
        lg: `0 0 40px ${accent}4d`,
        blueXs: `0 0 6px ${p.blue}26`,
        blueSm: `0 0 12px ${p.blue}33`,
        blueMd: `0 0 24px ${p.blue}40`,
        purpleXs: `0 0 6px ${p.mauve}26`,
        purpleSm: `0 0 12px ${p.mauve}33`,
        purpleMd: `0 0 24px ${p.mauve}40`,
        brandSm: `0 0 12px ${accent}33`,
        brandMd: `0 0 24px ${accent}40`,
      },
    }
  }

  // Latte (Light)
  return {
    bg: {
      app: p.crust,          // #dce0e8 sunken chassis
      primary: p.base,       // #eff1f5 base canvas
      secondary: p.mantle,   // #e6e9ef card surface
      tertiary: p.surface0,  // #ccd0da elevated surface
    },
    surface: {
      s1: p.mantle,
      s2: p.surface0,
      s3: p.surface1,
      hover: `${p.text}10`,
      active: `${p.text}1c`,
      selected: `${accent}22`,
    },
    brand: {
      primary: accent,       // #1e66f5 (Blue) - clears WCAG AA easily
      primaryActive: '#1453cc',
      primaryHover: '#3879f8',
      accent: p.mauve,       // #8839ef
      accentHover: p.lavender,
    },
    gradient: {
      brand: `linear-gradient(135deg, ${accent} 0%, ${p.lavender} 50%, ${p.mauve} 100%)`,
      progress: `linear-gradient(90deg, ${accent} 0%, ${p.lavender} 100%)`,
      blueViolet: `linear-gradient(135deg, ${accent} 0%, ${p.mauve} 100%)`,
      ice: `linear-gradient(135deg, ${p.sky} 0%, ${p.sapphire} 50%, ${accent} 100%)`,
      spectrum: `linear-gradient(90deg, ${p.red} 0%, ${p.peach} 20%, ${p.yellow} 40%, ${p.green} 60%, ${p.blue} 80%, ${p.mauve} 100%)`,
    },
    text: {
      primary: p.text,       // #4c4f69 (10.5:1 contrast)
      secondary: p.subtext1, // #5c5f77 (7.5:1 contrast)
      tertiary: p.subtext0,  // #6c6f85
      muted: p.overlay2,     // #7c7f93
      disabled: p.overlay0,  // #9ca0b0
      placeholder: p.overlay0,
    },
    border: {
      subtle: `${p.text}1a`,
      default: `${p.text}2e`,
      hover: `${accent}66`,
      active: accent,
      focus: `${accent}88`,
    },
    semantic: {
      success: p.green,      // #40a02b
      warning: p.yellow,     // #df8e1d
      error: p.red,          // #d20f39
      info: p.blue,          // #1e66f5
    },
    music: {
      playing: p.green,
      lyrics: p.subtext1,
      lyricsActive: accent,
      lyricsHighlight: p.text,
      waveform: `${p.text}33`,
      waveformActive: accent,
    },
    glow: {
      xs: `0 0 6px ${accent}20`,
      sm: `0 0 12px ${accent}28`,
      md: `0 0 20px ${accent}33`,
      lg: `0 0 32px ${accent}3d`,
    },
  }
}

export function generateThemeJson(
  flavorId: string,
  glassmorphism = false,
  accentName?: CatppuccinAccent,
) {
  const flavorKey = (flavorId.replace('catppuccin-', '') || 'mocha') as CatppuccinFlavorId
  const flavor = CATPPUCCIN_FLAVORS[flavorKey] || CATPPUCCIN_FLAVORS.mocha
  const tokens = buildBBeBeeTokens(flavor.flavor, accentName)
  const p = CATPPUCCIN_RAW_PALETTES[flavor.flavor]

  const baseCssVars: Record<string, string> = {
    '--bb-radius-sm': '6px',
    '--bb-radius-md': '10px',
    '--bb-radius-pill': '999px',
    '--catppuccin-rosewater': p.rosewater,
    '--catppuccin-flamingo': p.flamingo,
    '--catppuccin-pink': p.pink,
    '--catppuccin-mauve': p.mauve,
    '--catppuccin-red': p.red,
    '--catppuccin-maroon': p.maroon,
    '--catppuccin-peach': p.peach,
    '--catppuccin-yellow': p.yellow,
    '--catppuccin-green': p.green,
    '--catppuccin-teal': p.teal,
    '--catppuccin-sky': p.sky,
    '--catppuccin-sapphire': p.sapphire,
    '--catppuccin-blue': p.blue,
    '--catppuccin-lavender': p.lavender,
    '--catppuccin-text': p.text,
    '--catppuccin-base': p.base,
    '--catppuccin-mantle': p.mantle,
    '--catppuccin-crust': p.crust,
  }

  return {
    id: flavor.id,
    name: flavor.name,
    description: `Official ${flavor.name} theme from the Catppuccin palette collection.`,
    isDark: flavor.isDark,
    tokens,
    cssVariables: baseCssVars,
  }
}
