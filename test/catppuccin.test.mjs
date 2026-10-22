import test from 'node:test'
import assert from 'node:assert/strict'
import {
  CATPPUCCIN_FLAVORS,
  CATPPUCCIN_RAW_PALETTES,
  buildBBeBeeTokens,
  generateThemeJson,
} from '../src/palettes.ts'
import { getGlassCssVariables } from '../src/glass.ts'

// Relative luminance formula per WCAG 2.1
function hexToLuminance(hex) {
  const clean = hex.replace('#', '').slice(0, 6)
  const rgb = [0, 2, 4].map((offset) => {
    const c = parseInt(clean.substring(offset, offset + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

function contrastRatio(hex1, hex2) {
  const l1 = hexToLuminance(hex1)
  const l2 = hexToLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

test('all 4 Catppuccin palettes exist with complete colors', () => {
  const flavors = ['mocha', 'macchiato', 'frappe', 'latte']
  for (const f of flavors) {
    const palette = CATPPUCCIN_RAW_PALETTES[f]
    assert.ok(palette, `Palette for ${f} should exist`)
    assert.ok(palette.base.startsWith('#'), `${f}.base should be a hex color`)
    assert.ok(palette.text.startsWith('#'), `${f}.text should be a hex color`)
    assert.ok(palette.mauve.startsWith('#'), `${f}.mauve should be a hex color`)
    assert.ok(palette.blue.startsWith('#'), `${f}.blue should be a hex color`)
  }
})

test('BBeBee token builder produces valid categories and contrast', () => {
  for (const flavor of ['mocha', 'macchiato', 'frappe', 'latte']) {
    const tokens = buildBBeBeeTokens(flavor)
    assert.ok(tokens.bg.app, `${flavor} bg.app missing`)
    assert.ok(tokens.bg.primary, `${flavor} bg.primary missing`)
    assert.ok(tokens.surface.s1, `${flavor} surface.s1 missing`)
    assert.ok(tokens.text.primary, `${flavor} text.primary missing`)
    assert.ok(tokens.brand.primary, `${flavor} brand.primary missing`)

    // Check WCAG AA text contrast on primary background
    const ratio = contrastRatio(tokens.text.primary, tokens.bg.primary)
    assert.ok(
      ratio >= 4.5,
      `${flavor} text.primary (${tokens.text.primary}) on bg.primary (${tokens.bg.primary}) failed WCAG AA: ratio is ${ratio.toFixed(2)}:1`,
    )
  }
})

test('generateThemeJson outputs valid BBeBee theme structure', () => {
  const mochaJson = generateThemeJson('catppuccin-mocha')
  assert.equal(mochaJson.id, 'catppuccin-mocha')
  assert.equal(mochaJson.isDark, true)
  assert.ok(mochaJson.tokens.bg.primary)
  assert.ok(mochaJson.cssVariables['--catppuccin-mauve'])

  const latteJson = generateThemeJson('catppuccin-latte')
  assert.equal(latteJson.id, 'catppuccin-latte')
  assert.equal(latteJson.isDark, false)
})

test('getGlassCssVariables produces glassmorphism variables when enabled', () => {
  const vars = getGlassCssVariables('mocha', { enabled: true, blurPx: 24, opacity: 0.8 })
  assert.equal(vars['--bb-glass-enabled'], '1')
  assert.equal(vars['--bb-glass-blur'], '24px')
  assert.ok(vars['--bg-app'].startsWith('rgba('))
  assert.ok(vars['--bevel-chamfer-top'])

  const disabledVars = getGlassCssVariables('mocha', { enabled: false })
  assert.equal(disabledVars['--bb-glass-enabled'], '0')
})
