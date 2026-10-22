/**
 * Catppuccin Theme Suite — Headless Cordis Plugin.
 *
 * Registers the 4 official Catppuccin flavours (Latte, Frappé, Macchiato, Mocha)
 * into `ctx.theme`, registers the Glassmorphism engine, and contributes the
 * interactive settings card into BBeBee settings.
 */

import { CATPPUCCIN_FLAVORS, generateThemeJson, type CatppuccinAccent, type CatppuccinFlavorId } from './palettes.ts'
import { applyGlassmorphismToDom, getGlassCssVariables } from './glass.ts'

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
  const themeDisposers = new Map<string, () => void>()

  let currentPrefs = loadStoredPrefs()

  // Function to register or update Catppuccin themes in ctx.theme
  function registerThemesWithPrefs(prefs: CatppuccinPrefs) {
    if (!ctx.theme?.registerTheme) return

    for (const meta of Object.values(CATPPUCCIN_FLAVORS)) {
      const themeDef = generateThemeJson(meta.id, prefs.glassEnabled, prefs.accent)

      // If glassmorphism is active and matches current theme, attach glass variables
      if (prefs.glassEnabled) {
        const glassVars = getGlassCssVariables(meta.flavor, {
          enabled: true,
          blurPx: prefs.glassBlur,
          opacity: prefs.glassOpacity,
        })
        themeDef.cssVariables = {
          ...(themeDef.cssVariables || {}),
          ...glassVars,
        }
      }

      // Re-register theme
      const existingDisposer = themeDisposers.get(meta.id)
      if (existingDisposer) {
        existingDisposer()
      }
      const disposer = ctx.theme.registerTheme(themeDef)
      themeDisposers.set(meta.id, disposer)
    }
  }

  // 1. Initial registration of the 4 flavours
  registerThemesWithPrefs(currentPrefs)

  // 2. React to theme change events to apply glass style tag if Catppuccin is active
  const offThemeChange = ctx.on('theme/changed', (theme: any) => {
    if (theme?.id?.startsWith('catppuccin-')) {
      const flavorKey = theme.id.replace('catppuccin-', '') as CatppuccinFlavorId
      applyGlassmorphismToDom(flavorKey, {
        enabled: currentPrefs.glassEnabled,
        blurPx: currentPrefs.glassBlur,
        opacity: currentPrefs.glassOpacity,
      })
    } else {
      // Non-catppuccin theme active, remove glass style tag
      applyGlassmorphismToDom('mocha', { enabled: false })
    }
  })
  disposers.push(offThemeChange)

  // 3. Contribute settings card via ctx.ui
  ctx.inject(['ui'], (scoped: any) => {
    const unregisterSettings = scoped.ui.contribute({
      kind: 'settings',
      id: 'theme.catppuccin',
      section: 'general',
      title: 'Catppuccin Theme Suite',
      description: 'Soothing pastel theme collection for BBeBee with 4 official flavours and frosted glassmorphism.',
      icon: 'palette',
      display: 'card',
      order: 25,
    })
    disposers.push(unregisterSettings)
  })

  // 4. Listen for preferences update broadcast
  const offPrefsUpdate = ctx.on('catppuccin/update-prefs', (newPrefs: Partial<CatppuccinPrefs>) => {
    currentPrefs = { ...currentPrefs, ...newPrefs }
    saveStoredPrefs(currentPrefs)
    registerThemesWithPrefs(currentPrefs)

    const activeTheme = ctx.theme?.getCurrentTheme?.()
    if (activeTheme?.id?.startsWith('catppuccin-')) {
      const flavorKey = activeTheme.id.replace('catppuccin-', '') as CatppuccinFlavorId
      applyGlassmorphismToDom(flavorKey, {
        enabled: currentPrefs.glassEnabled,
        blurPx: currentPrefs.glassBlur,
        opacity: currentPrefs.glassOpacity,
      })
      // Trigger theme re-application to pick up new cssVariables
      void ctx.theme?.setTheme?.(activeTheme.id)
    }
  })
  disposers.push(offPrefsUpdate)

  ctx.logger?.info?.('plugin-catppuccin-theme: ready (Mocha, Macchiato, Frappé, Latte registered)')

  return () => {
    for (const d of themeDisposers.values()) d()
    for (const d of disposers) d()
    applyGlassmorphismToDom('mocha', { enabled: false })
    ctx.logger?.info?.('plugin-catppuccin-theme: disposed')
  }
}

export default { name, inject, apply }
