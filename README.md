# Catppuccin Theme Suite for BBeBee (`B_Be_Bee-catppuccin-theme`)

<p align="center">
  <img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/palette/macchiato.png" width="400" alt="Catppuccin Palette" />
</p>

[BBeBee 音乐播放器](https://github.com/BBeBeeX/B_Be_Bee) 的官方 Catppuccin 扩展主题套件：
包含 **Latte**（浅色）、**Frappé**（中暗）、**Macchiato**（深暗）与 **Mocha**（极夜暗）四种经典马卡龙风味，深度适配 BBeBee 设计令牌体系。四种风味注册为**一个主题包（ThemePack）的四个变体**，在宿主的主题设置中切换；磨砂玻璃以主题预设（`effects.glass`）声明、由宿主渲染。

参考灵感来自 [NoNameLeGo/dsh-catppuccin-theme](https://github.com/NoNameLeGo/dsh-catppuccin-theme)。

---

## ✨ 核心特性

- **四种官方风味全覆盖**：
  - ☕ **Latte**（亮色模式）：高对比度柔和米白底板（`#eff1f5`），蓝/紫强调色，通过 WCAG AA 门禁（对比度达 10.5:1）。
  - 🍧 **Frappé**（柔和暗色）：低眩光暗蓝灰色阶（`#303446`）。
  - 🍵 **Macchiato**（舒适暗色）：沉浸式午夜深蓝灰色（`#24273a`）。
  - 🍫 **Mocha**（经典极深暗）：猫咪纯黑与薰衣草紫阶（`#1e1e2e` / `#11111b`）。
- **7 种经典马卡龙强调色（Accent Colors）**：
  - Mauve（猫咪紫 `#cba6f7`）、Lavender（薰衣草 `#b4befe`）、Blue（冰川蓝 `#89b4fa`）、Pink（火烈鸟粉 `#f5c2e7`）、Teal（薄荷绿 `#94e2d5`）、Green（抹茶绿 `#a6e3a1`）、Peach（蜜桃橙 `#fab387`）。
- **可开关的磨砂玻璃预设（Glassmorphism preset）**：
  - 玻璃不再靠插件注入样式实现：开启后，每个变体携带 `effects.glass` 预设，由**宿主**为侧栏、主区、播放栏与浮层渲染磨砂质感。
  - 可在插件设置卡片中调节预设的**模糊半径（8px ~ 36px）**与**表面不透明度（50% ~ 95%）**；宿主中用户的玻璃设置（组件层数值、按表面覆盖、窗口系统效果）永远优先于本预设。
- **双模使用支持**：
  - **模式 A（插件模式）**：作为 BBeBee 扩展插件加载，经 `ctx.theme.registerThemePack` 把四种风味注册为一个主题包 —— 风味切换在宿主「设置」的主题卡片「通用」分类中完成（插件包与内置主题同组展示）；插件自身的设置卡片（设置左导航的独立 Catppuccin 入口）只负责强调色与玻璃预设。旧版宿主（无 `registerThemePack`）自动回退为逐个注册四种风味。
  - **模式 B（声明式主题包模式）**：开箱提供独立的 `themes/*.json`，可直接导入播放器或提交到注册表仓库，无需代码即可直接应用。

---

## 🎨 色彩与设计令牌映射（Token Mapping）

本主题套件精准映射至 BBeBee 的 Layer 2 语义设计令牌（`@BBeBee/ui-tokens`）：

| BBeBee 语义令牌 | Catppuccin 对应角色（Mocha 为例） | 色值 | 说明 |
|---|---|---|---|
| `--bg-app` / `--player-bg` | Crust | `#11111b` | 最底层外壳机身、底栏播放器底色 |
| `--bg-primary` / `--bb-bg-base` | Base | `#1e1e2e` | 主内容画布底色 |
| `--surface-1` / `--card-bg` | Surface0 | `#313244` | 卡片、面板、悬浮容器 |
| `--surface-2` | Surface1 | `#45475a` | 悬浮高亮、二级面板 |
| `--text-primary` | Text | `#cdd6f4` | 主文本（通过 WCAG AA 验证） |
| `--text-secondary` | Subtext0 | `#a6adc8` | 次级文本、副标题、时间戳 |
| `--primary` / `--accent` | Mauve / Blue | `#cba6f7` | 品牌强调色、主操作播放按钮 |
| `--semantic-success` | Green | `#a6e3a1` | 播放状态指示、收藏高亮 |
| `--bevel-chamfer-top` | 顶层高光 | `inset 0 1px 0 rgba(255,255,255,0.18)` | 1px 倒角切面反光微质感 |

---

## 🚀 安装与使用方法

### 方式 1：直接导入单体主题包（零依赖，最简单）
在 `themes/` 目录下已预先生成了标准格式的主题文件：
- `catppuccin-pack.json`（主题包：四种风味合一，导入后在主题卡片的「自定义」分类中按包切换风味；玻璃质感是包内预设，不再是独立文件）
- `catppuccin-mocha.json`
- `catppuccin-macchiato.json`
- `catppuccin-frappe.json`
- `catppuccin-latte.json`

**使用步骤**：
1. 打开 BBeBee 客户端，进入「设置」中的主题卡片；
2. 切到「自定义」分类，点击「导入主题」；
3. 将上述任意 `.json` 文件拖入或复制粘贴内容导入，即可立即生效！导入的主题包会出现在「自定义」分类中，包内风味可直接切换。

### 方式 2：作为完整插件安装（拥有全功能设置卡片）
1. 编译产物：
   ```bash
   pnpm build   # 或 node build.mjs
   ```
2. 将本目录打包或链接至桌面客户端的插件目录：
   - 包含 `BBeBee.plugin.json` 与 `dist/` 目录；
3. 在客户端「设置」->「插件管理」启用后：主题卡片「通用」分类中会出现 Catppuccin 主题包，四种风味在包内切换；设置左导航的 **🐱 Catppuccin** 专属入口提供强调色选择与玻璃预设开关/数值调节。

---

## 🛠️ 项目构建与测试

```bash
# 1. 编译生成 dist/ 产物与 themes/*.json
node build.mjs

# 2. 运行 WCAG AA 对比度与 Token 完整性自动化测试
node --test test/catppuccin.test.mjs
```

---

## 📄 许可证与致谢

- 本项目基于 [MIT License](LICENSE) 开源。
- 调色板版权归 [Catppuccin Org](https://github.com/catppuccin) 所有。
- 架构设计致敬 [NoNameLeGo/dsh-catppuccin-theme](https://github.com/NoNameLeGo/dsh-catppuccin-theme)。
