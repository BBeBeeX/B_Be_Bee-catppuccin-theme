/**
 * The Catppuccin ThemePack: all four flavours as variants of ONE pack.
 *
 * The pack is the unit the host's theme service registers
 * (`registerThemePack`) and the settings page groups under 通用， with
 * each flavour a selectable variant — replacing the old model of four
 * independent theme registrations (plus a fifth pseudo-variant for
 * glass). Glass is no longer a variant or a DOM hack: when enabled it
 * travels as the variants' `effects.glass` preset, which the host
 * renders (user glass settings still win over the preset).
 */

import { CATPPUCCIN_FLAVORS, generateThemeJson, type CatppuccinAccent } from './palettes.ts'

export const CATPPUCCIN_PACK_ID = 'catppuccin'
export const CATPPUCCIN_PACK_VERSION = '1.0.0'

export interface CatppuccinPackPrefs {
  accent: CatppuccinAccent
  glassEnabled: boolean
  glassBlur: number
  /** 0..1 in the prefs store; the preset speaks the protocol's 0..100. */
  glassOpacity: number
}

export interface CatppuccinThemePack {
  id: string
  name: string
  description: string
  author: string
  version: string
  origin: 'plugin'
  variants: Array<Record<string, unknown>>
  preview: { colors: [string, string, string] }
}

export function buildCatppuccinPack(prefs: CatppuccinPackPrefs): CatppuccinThemePack {
  const variants = Object.values(CATPPUCCIN_FLAVORS).map((meta) => {
    const themeDef = generateThemeJson(meta.id, false, prefs.accent) as Record<string, unknown>
    if (prefs.glassEnabled) {
      themeDef.effects = {
        glass: {
          blurPx: prefs.glassBlur,
          saturate: 180,
          opacity: Math.round(prefs.glassOpacity * 100),
        },
      }
    }
    return themeDef
  })
  const mocha = variants.find((v) => v.id === 'catppuccin-mocha') ?? variants[0]!
  const mochaTokens = mocha.tokens as {
    bg: { primary: string }
    surface: { s1: string }
    brand: { primary: string }
  }
  return {
    id: CATPPUCCIN_PACK_ID,
    name: 'Catppuccin',
    description: 'Soothing pastel theme suite: Latte, Frappé, Macchiato and Mocha as variants of one pack.',
    author: 'Catppuccin Org & BBeBee Community',
    version: CATPPUCCIN_PACK_VERSION,
    origin: 'plugin',
    variants,
    preview: {
      colors: [mochaTokens.bg.primary, mochaTokens.surface.s1, mochaTokens.brand.primary],
    },
  }
}
