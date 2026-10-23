import { useEffect, useState } from 'react'
import { type CatppuccinAccent } from './palettes.ts'
import { loadStoredPrefs, type CatppuccinPrefs } from './index.ts'

const ACCENT_LIST: Array<{ key: CatppuccinAccent; name: string; hex: string }> = [
  { key: 'mauve', name: 'Mauve (猫咪紫)', hex: '#cba6f7' },
  { key: 'lavender', name: 'Lavender (薰衣草)', hex: '#b4befe' },
  { key: 'blue', name: 'Blue (冰川蓝)', hex: '#89b4fa' },
  { key: 'pink', name: 'Pink (火烈鸟粉)', hex: '#f5c2e7' },
  { key: 'teal', name: 'Teal (薄荷绿)', hex: '#94e2d5' },
  { key: 'green', name: 'Green (抹茶绿)', hex: '#a6e3a1' },
  { key: 'peach', name: 'Peach (蜜桃橙)', hex: '#fab387' },
]

export function CatppuccinSettingsCard({ ctx }: { ctx: any }) {
  const [prefs, setPrefs] = useState<CatppuccinPrefs>(() => loadStoredPrefs())
  const [currentThemeId, setCurrentThemeId] = useState<string>(
    () => ctx?.theme?.getCurrentTheme?.()?.id ?? 'catppuccin-mocha',
  )

  useEffect(() => {
    const update = (theme: any) => {
      if (theme?.id) setCurrentThemeId(theme.id)
    }
    const off = ctx?.on?.('theme/changed', update)
    return () => off?.()
  }, [ctx])

  const handleSelectAccent = (accent: CatppuccinAccent) => {
    setPrefs((prev) => {
      const next = { ...prev, accent }
      ctx?.emit?.('catppuccin/update-prefs', next)
      return next
    })
  }

  const handleToggleGlass = (enabled: boolean) => {
    setPrefs((prev) => {
      const next = { ...prev, glassEnabled: enabled }
      ctx?.emit?.('catppuccin/update-prefs', next)
      return next
    })
  }

  const handleBlurChange = (blur: number) => {
    setPrefs((prev) => {
      const next = { ...prev, glassBlur: blur }
      ctx?.emit?.('catppuccin/update-prefs', next)
      return next
    })
  }

  const handleOpacityChange = (opacity: number) => {
    setPrefs((prev) => {
      const next = { ...prev, glassOpacity: opacity }
      ctx?.emit?.('catppuccin/update-prefs', next)
      return next
    })
  }

  return (
    <section
      data-testid="catppuccin-settings-card"
      style={{
        background: 'var(--settings-card-bg, rgba(255, 255, 255, 0.04))',
        border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.08))',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 24,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text-primary, #FFFFFF)' }}>
            🐱 Catppuccin Theme Suite
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary, #8E8E93)' }}>
            包含 Latte / Frappé / Macchiato / Mocha 四种经典马卡龙风味，支持毛玻璃拟态质感
          </p>
        </div>
        <span
          style={{
            fontSize: 12,
            padding: '3px 8px',
            borderRadius: 6,
            background: 'var(--surface-selected, rgba(203, 166, 247, 0.15))',
            color: 'var(--primary, #cba6f7)',
            fontWeight: 600,
          }}
        >
          v1.0.0
        </span>
      </div>

      {/* Flavours are pack variants now: switching lives in the host's
          theme settings (通用 category); this card keeps accent + glass. */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
          主题风味（Flavor）
        </label>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary, #8E8E93)', lineHeight: 1.5 }}>
          Latte / Frappé / Macchiato / Mocha 已合并为一个主题包，请在「设置 → 通用 → 主题」中切换风味。
          当前主题：{currentThemeId}
        </p>
      </div>

      {/* 2. Accent Color Picker */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
          马卡龙强调色（Accent Color）
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ACCENT_LIST.map((acc) => {
            const isSelected = prefs.accent === acc.key
            return (
              <button
                key={acc.key}
                onClick={() => handleSelectAccent(acc.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: isSelected ? `2px solid ${acc.hex}` : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--surface-selected, rgba(255,255,255,0.08))' : 'transparent',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: isSelected ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: acc.hex,
                    boxShadow: isSelected ? `0 0 8px ${acc.hex}` : 'none',
                  }}
                />
                {acc.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Glassmorphism Toggle & Sliders */}
      <div
        style={{
          background: 'var(--surface-1, rgba(255, 255, 255, 0.03))',
          borderRadius: 12,
          padding: '14px 18px',
          border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.06))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              💎 磨砂玻璃质感（Glassmorphism）
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              作为主题包的玻璃预设提供给宿主渲染；你在「通用 → 玻璃质感」中的设置优先于此预设
            </div>
          </div>
          <button
            onClick={() => handleToggleGlass(!prefs.glassEnabled)}
            style={{
              width: 48,
              height: 26,
              borderRadius: 999,
              background: prefs.glassEnabled ? 'var(--primary, #cba6f7)' : 'var(--border-default, #585b70)',
              position: 'relative',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#FFFFFF',
                position: 'absolute',
                top: 3,
                left: prefs.glassEnabled ? 25 : 3,
                transition: 'left 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </button>
        </div>

        {/* Sliders when glass is enabled */}
        {prefs.glassEnabled && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>模糊半径 (Blur)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prefs.glassBlur}px</span>
              </div>
              <input
                type="range"
                min={8}
                max={36}
                value={prefs.glassBlur}
                onChange={(e) => handleBlurChange(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                <span>表面透明度 (Opacity)</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{Math.round(prefs.glassOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={Math.round(prefs.glassOpacity * 100)}
                onChange={(e) => handleOpacityChange(Number(e.target.value) / 100)}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export const name = 'plugin-catppuccin-theme-ui'

export function apply(ctx: any) {
  ctx.logger?.info?.('plugin-catppuccin-theme-ui: registering settings view')
  return ctx.ui?.registerView?.('theme.catppuccin', (props: any) => (
    <CatppuccinSettingsCard {...props} ctx={ctx} />
  ))
}

export default { name, apply }
