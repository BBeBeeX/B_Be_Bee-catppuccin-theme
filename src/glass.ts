/**
 * Catppuccin Glassmorphism (Frosted Acrylic Glass) Styling Engine.
 *
 * Provides toggleable translucent frosted glass effects for BBeBee:
 * - TopBar & Navigation
 * - Left Sidebar / Navigation rail
 * - Persistent Bottom Player Bar
 * - Cards & Modal Dialogs
 * - Volume / Context Menu Popovers
 */

import { CATPPUCCIN_RAW_PALETTES, type CatppuccinFlavorId } from './palettes.ts'

export interface GlassOptions {
  enabled: boolean
  blurPx?: number
  opacity?: number
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getGlassCssVariables(
  flavor: CatppuccinFlavorId,
  options: GlassOptions = { enabled: true, blurPx: 20, opacity: 0.78 },
): Record<string, string> {
  if (!options.enabled) {
    return {
      '--bb-glass-enabled': '0',
    }
  }

  const p = CATPPUCCIN_RAW_PALETTES[flavor]
  const isDark = flavor !== 'latte'
  const blur = options.blurPx ?? 20
  const opacity = options.opacity ?? (isDark ? 0.78 : 0.85)

  const glassBg = hexToRgba(p.base, opacity)
  const glassChassis = hexToRgba(p.crust, Math.min(0.92, opacity + 0.1))
  const glassCard = hexToRgba(p.surface0, Math.max(0.4, opacity - 0.2))
  const glassBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(76, 79, 105, 0.15)'
  const bevelChamfer = isDark
    ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.18)'
    : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.75)'

  return {
    '--bb-glass-enabled': '1',
    '--bb-glass-blur': `${blur}px`,
    '--bb-glass-opacity': `${opacity}`,
    '--bg-app': glassChassis,
    '--player-bg': glassChassis,
    '--card-bg': glassCard,
    '--settings-card-bg': glassCard,
    '--bevel-chamfer-top': bevelChamfer,
    '--border-subtle': glassBorder,
    '--shadow-dropdown-layered': isDark
      ? `0 1px 2px rgba(0, 0, 0, 0.45), 0 12px 32px rgba(0, 0, 0, 0.65), 0 24px 48px -8px rgba(0, 0, 0, 0.85)`
      : `0 1px 2px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.12), 0 20px 40px -4px rgba(0, 0, 0, 0.16)`,
    '--card-shadow-elevated': isDark
      ? `0 1px 2px rgba(0, 0, 0, 0.35), 0 6px 16px rgba(0, 0, 0, 0.45), 0 16px 32px -4px rgba(0, 0, 0, 0.65)`
      : `0 1px 2px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.08), 0 16px 32px -4px rgba(0, 0, 0, 0.12)`,
  }
}

const STYLE_TAG_ID = 'bbebee-catppuccin-glass-style'

export function applyGlassmorphismToDom(
  flavor: CatppuccinFlavorId,
  options: GlassOptions,
): void {
  if (typeof document === 'undefined') return

  let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null
  if (!options.enabled) {
    if (styleTag) styleTag.remove()
    return
  }

  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = STYLE_TAG_ID
    document.head.appendChild(styleTag)
  }

  const blur = options.blurPx ?? 20
  const isDark = flavor !== 'latte'

  styleTag.textContent = `
    /* Catppuccin Glassmorphism Rules */
    :root[data-theme^="catppuccin-"] header,
    :root[data-theme^="catppuccin-"] aside,
    :root[data-theme^="catppuccin-"] [data-testid="bottom-bar"],
    :root[data-theme^="catppuccin-"] [data-testid="now-playing-bar"],
    :root[data-theme^="catppuccin-"] .glass-surface {
      backdrop-filter: blur(${blur}px) saturate(180%) !important;
      -webkit-backdrop-filter: blur(${blur}px) saturate(180%) !important;
    }

    :root[data-theme^="catppuccin-"] [data-testid="theme-management-card"],
    :root[data-theme^="catppuccin-"] [data-testid="catppuccin-settings-card"] {
      backdrop-filter: blur(${Math.max(12, blur - 4)}px) saturate(160%) !important;
      -webkit-backdrop-filter: blur(${Math.max(12, blur - 4)}px) saturate(160%) !important;
      border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(76, 79, 105, 0.15)'} !important;
      border-radius: 12px !important;
    }
  `
}
