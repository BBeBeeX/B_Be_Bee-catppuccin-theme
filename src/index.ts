/**
 * Catppuccin Theme Suite — Headless Cordis Plugin.
 *
 * Registers the 4 official Catppuccin flavours (Latte, Frappé, Macchiato,
 * Mocha) as ONE ThemePack into `ctx.theme` (the host settings page lists
 * the pack under 通用 and switches flavours as pack variants), and
 * contributes the accent/glass-preset settings card. On hosts without
 * the pack API it falls back to per-flavour `registerTheme` calls.
 *
 * Glass is a pack-level preset, not a theme and not DOM injection: the
 * variants carry `effects.glass` values that the host renders; the
 * user's own glass settings always override the preset.
 */

import type { CatppuccinAccent, CatppuccinFlavorId } from './palettes.ts'
import { buildCatppuccinPack } from './pack.ts'

export interface CatppuccinPrefs {
  flavor: CatppuccinFlavorId
  accent: CatppuccinAccent
  glassEnabled: boolean
  glassBlur: number
  glassOpacity: number
}

export const DEFAULT_PREFS: CatppuccinPrefs = {
  flavor: 'mocha',
  accent: 'mauve',
  glassEnabled: false,
  glassBlur: 20,
  glassOpacity: 0.78,
}

const PREFS_STORAGE_KEY = 'bbebee_catppuccin_prefs'

export function loadStoredPrefs(): CatppuccinPrefs {
  if (typeof localStorage === 'undefined') return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(PREFS_STORAGE_KEY)
    if (raw) {
      return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
    }
  } catch {
    // fallback
  }
  return DEFAULT_PREFS
}

export function saveStoredPrefs(prefs: CatppuccinPrefs): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

export const name = 'plugin-catppuccin-theme'
export const inject = ['theme']

export async function apply(ctx: any) {
  ctx.logger?.info?.('plugin-catppuccin-theme: initializing')

  const disposers: Array<() => void> = []
  let packDisposer: (() => void) | undefined
  const themeDisposers = new Map<string, () => void>()

  let currentPrefs = loadStoredPrefs()

  // Register or update the Catppuccin pack with the current prefs. When a
  // Catppuccin variant is active, the host re-applies it on pack
  // re-registration, so accent/glass changes repaint live.
  function registerThemesWithPrefs(prefs: CatppuccinPrefs) {
    const pack = buildCatppuccinPack(prefs)
    if (typeof ctx.theme?.registerThemePack === 'function') {
      packDisposer?.()
      packDisposer = ctx.theme.registerThemePack(pack)
      return
    }
    // Fallback for hosts predating the ThemePack API: one registration
    // per flavour, as before.
    if (!ctx.theme?.registerTheme) return
    for (const variant of pack.variants) {
      const themeDef = { ...variant }
      delete (themeDef as Record<string, unknown>).effects
      themeDisposers.get(themeDef.id as string)?.()
      themeDisposers.set(themeDef.id as string, ctx.theme.registerTheme(themeDef))
    }
  }

  // 1. Initial registration
  registerThemesWithPrefs(currentPrefs)

  // 2. Contribute settings card via ctx.ui. The section is this plugin's
  // own custom section ('catppuccin'), not a built-in one: both shells
  // promote a custom section to a top-level settings entry — a left-nav
  // tab on desktop, its own anchored section on mobile — so the card
  // gets its own settings page instead of being embedded in General.
  ctx.inject(['ui'], (scoped: any) => {
    const unregisterSettings = scoped.ui.contribute({
      kind: 'settings',
      id: 'theme.catppuccin',
      section: 'catppuccin',
      title: 'Catppuccin Theme Suite',
      description: 'Soothing pastel theme collection for BBeBee with 4 official flavours and a host-rendered glass preset.',
      icon: 'palette',
      display: 'card',
      order: 25,
    })
    disposers.push(unregisterSettings)
  })

  // 3. Listen for preferences update broadcast: re-registering the pack
  // is the whole update path (the host repaints the active variant).
  const offPrefsUpdate = ctx.on('catppuccin/update-prefs', (newPrefs: Partial<CatppuccinPrefs>) => {
    currentPrefs = { ...currentPrefs, ...newPrefs }
    saveStoredPrefs(currentPrefs)
    registerThemesWithPrefs(currentPrefs)
  })
  disposers.push(offPrefsUpdate)

  ctx.logger?.info?.('plugin-catppuccin-theme: ready (pack "catppuccin" with Mocha, Macchiato, Frappé, Latte variants)')

  return () => {
    packDisposer?.()
    for (const d of themeDisposers.values()) d()
    for (const d of disposers) d()
    ctx.logger?.info?.('plugin-catppuccin-theme: disposed')
  }
}

export default { name, inject, apply }
