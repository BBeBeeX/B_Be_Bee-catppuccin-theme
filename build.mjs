#!/usr/bin/env node
/* global console, process */
/**
 * build.mjs — builds the two entry bundles of @bbebee/plugin-catppuccin-theme:
 *
 *   src/index.ts  →  dist/index.js        (headless plugin def, entry.main)
 *   src/ui.tsx    →  dist/ui-desktop.js   (UI settings card def, entry.ui.desktop)
 *
 * Externalizes host-shared React modules (react, react-dom, etc.) so the plugin
 * shares the single React instance provided by BBeBee Desktop shell import maps.
 */

import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CATPPUCCIN_FLAVORS, generateThemeJson } from './src/palettes.ts'
import { buildCatppuccinPack } from './src/pack.ts'

const packageDir = dirname(fileURLToPath(import.meta.url))

function loadEsbuild() {
  const require = createRequire(import.meta.url)
  const candidates = [
    join(packageDir, 'node_modules'),
    join(packageDir, '..', 'BBeBee', 'node_modules', '.pnpm', 'node_modules'),
    join(packageDir, '..', 'BBeBee', 'node_modules'),
    join(packageDir, '..', 'B_Be_Bee', 'node_modules', '.pnpm', 'node_modules'),
    join(packageDir, '..', 'B_Be_Bee', 'node_modules'),
    join(packageDir, '..', 'node_modules'),
  ]
  for (const base of candidates) {
    try {
      return require(require.resolve('esbuild', { paths: [base] }))
    } catch {
      // try next candidate
    }
  }
  throw new Error(
    'esbuild not found: run `pnpm install` in B_Be_Bee or this directory.',
  )
}

const HOST_EXTERNALS = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
]

const REACT_IMPL_MARKERS = [
  '__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED',
  'ReactCurrentOwner',
  'ReactCurrentDispatcher',
  'react.production',
  'react-dom.production',
  'scheduler.production',
]

function fail(message) {
  console.error(`build: ${message}`)
  process.exit(1)
}

function assertUiBundle(code) {
  for (const marker of REACT_IMPL_MARKERS) {
    if (code.includes(marker)) {
      fail(
        `dist/ui-desktop.js contains bundled React implementation ("${marker}"). ` +
          'Host-shared modules must remain external.',
      )
    }
  }
  const bareHostImport = HOST_EXTERNALS.some((s) =>
    new RegExp(`(?:from\\s*|import\\s*)["']${s.replace('/', '\\/')}["']`).test(code),
  )
  if (!bareHostImport) {
    fail(
      `dist/ui-desktop.js contains no bare host-module import (${HOST_EXTERNALS.join(', ')}).`,
    )
  }
}

function assertHeadlessBundle(code) {
  const hostImport = HOST_EXTERNALS.find((s) =>
    new RegExp(`(?:from\\s*|import\\s*|require\\()["']${s.replace('/', '\\/')}["']`).test(code),
  )
  if (hostImport) {
    fail(
      `dist/index.js imports "${hostImport}" — headless plugin must not import host UI modules.`,
    )
  }
}

// 1. Export standalone JSON themes to themes/ directory
const themesDir = join(packageDir, 'themes')
mkdirSync(themesDir, { recursive: true })

for (const flavor of Object.values(CATPPUCCIN_FLAVORS)) {
  const jsonContent = generateThemeJson(flavor.id, false)
  writeFileSync(join(themesDir, `${flavor.id}.json`), JSON.stringify(jsonContent, null, 2), 'utf8')
}

// The pack document: all four flavours in one file — the distribution
// shape the registry and the host's pack import consume. Glass is a
// preset field inside it, never a separate pseudo-variant file.
const pack = buildCatppuccinPack({ accent: 'mauve', glassEnabled: false, glassBlur: 20, glassOpacity: 0.78 })
writeFileSync(join(themesDir, 'catppuccin-pack.json'), JSON.stringify(pack, null, 2), 'utf8')
console.log('themes/*.json + themes/catppuccin-pack.json generated successfully.')

// 2. Bundle with esbuild
const esbuild = loadEsbuild()

const common = {
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
}

await esbuild.build({
  ...common,
  entryPoints: [join(packageDir, 'src', 'index.ts')],
  outfile: join(packageDir, 'dist', 'index.js'),
})

await esbuild.build({
  ...common,
  entryPoints: [join(packageDir, 'src', 'ui.tsx')],
  outfile: join(packageDir, 'dist', 'ui-desktop.js'),
  external: HOST_EXTERNALS,
  jsx: 'automatic',
})

const uiCode = readFileSync(join(packageDir, 'dist', 'ui-desktop.js'), 'utf8')
const headlessCode = readFileSync(join(packageDir, 'dist', 'index.js'), 'utf8')
assertUiBundle(uiCode)
assertHeadlessBundle(headlessCode)

for (const file of ['index.js', 'ui-desktop.js']) {
  const size = statSync(join(packageDir, 'dist', file)).size
  console.log(`dist/${file}  ${(size / 1024).toFixed(1)} KB`)
}

console.log('build: ok — Catppuccin theme plugin built successfully!')
