# dsh-deepseek-theme

把 Harness 网页界面换成 DeepSeek 聊天（chat.deepseek.com）的观感：品牌蓝、浅蓝侧栏、蓝色用户气泡，
以及侧栏与空白会话首页的 DeepSeek 鲸鱼标识。

插件安装后**默认禁用**，在「设置 → 插件」里手动启用即可；禁用后界面立刻恢复原样。

> **非官方**：个人制作的第三方主题插件，与杭州深度求索无隶属关系，商标归属见文末。

## 安装

本插件是 [DeepSeek-Harness-Plugin](https://github.com/folks666/DeepSeek-Harness-Plugin) 合集里的一个子目录，
在「设置 → 插件」里添加插件，安装地址填任一形式：

| 方式 | 填什么 |
|---|---|
| GitHub（跟随默认分支） | `github:folks666/DeepSeek-Harness-Plugin#path:/dsh-deepseek-theme` |
| GitHub（钉住某个标签） | `github:folks666/DeepSeek-Harness-Plugin#v0.1.0&path:/dsh-deepseek-theme` |
| 本地目录 | 本目录的绝对路径，例如 `D:\code\DeepSeek-Harness-Plugin\dsh-deepseek-theme` |
| 打包文件 | `dsh-deepseek-theme-0.1.0.tgz` 的绝对路径，或它的 https 地址 |

`#path:` 是 pnpm 从 git 仓库子目录取包的形式（`#` 后面是「提交/标签 + `&` + `path:`」），
填写时整个地址照抄即可，不需要另建单插件仓库。

装好后在插件列表里启用 `DeepSeek Theme`；卸载即在插件列表里移除 `dsh-deepseek-theme`。

GitHub 形式在安装前无法预读包信息（不会显示版本号），装完才补齐，这是正常的。安装会先做一次
`git ls-remote` 连通性检查，超时 5 秒；网络到不了 GitHub 时报 `failedAt: 'spec-host'`，改用 Release
里的 `.tgz` 地址或本地绝对路径即可，效果相同。

本插件无运行时依赖、无构建步骤：`client.js` 就是浏览器里直接执行的产物，装到哪个 profile 都用同一份文件。

## 做了什么

| 部位 | 改动 |
|---|---|
| 品牌色 | 主按钮、开关、勾选框、强调色从黑白换成 DeepSeek 蓝 `#4D6BFE` |
| 链接 / 焦点环 | 换成品牌蓝，深色模式用浅一档的蓝保证可读性 |
| 侧栏 | 浅蓝色底、选中项与悬停项的蓝色底纹 |
| 会话 | 用户气泡、命中高亮、输入卡片、代码块与行内代码的浅蓝灰底 |
| 品牌标识 | 侧栏 24px、首页 34px 换成 DeepSeek 官方鲸鱼标（品牌蓝单色）；侧栏字标保持官方 DeepSeek Harness 字标 |
| 新对话行图标 | 工作区选择器的文件夹图标、模式（Agent Preset）选择器的前置图标改成品牌蓝；只改颜色，形状、大小、位置不变，右侧下拉箭头不动 |

浅色 / 深色两套值都会提供，跟随「设置 → 通用 → 外观」的选择，无需额外配置。

实现方式只有三件事：向主题服务叠加一层**语义 token 覆盖**（`ctx.theme.overrideTokens`）、
一条只命中新对话行两个图标的一行样式、以及往两个品牌插槽（`sidebar.brand.mark`、
`conversation.hero.brand.mark`）注册组件。不改布局、不写宿主 DOM，所以 Harness 升级时最坏情况是
某个颜色回落到自带配色，不会白屏或报错。

## 实现要点

- **token 覆盖**：一层 29 个 `{ light, dark }` 语义 token，由主题服务合成进当前快照；
  主题注册表本身不动，禁用后整层撤回。
- **两个图标用一行样式染色**：工作区的文件夹图标和模式选择器的前置图标属于宿主 chrome，
  不是插槽，也没有独立 token（两者都跟 `--dsw-alias-label-primary` 走），改 token 会波及全站文字。
  所以只注入一条限定在 `heroWorkspaceRow` 行内的规则，靠 CSS Module 类名的**名字部分**匹配
  （`_folder`、`_seatIcon`，哈希前缀随构建变，名字稳定），且只设 `color`：

  ```css
  [class*="heroWorkspaceRow"] [class*="_folder"]  { color: var(--dsw-alias-brand-primary) }
  [class*="heroWorkspaceRow"] [class*="_seatIcon"]{ color: var(--dsw-alias-brand-primary) }
  ```

  两个选择器的权重都高于宿主原来的一级类规则，不需要 `!important`；`_chevron` 不在选择器里，
  所以右侧箭头保持原色。样式标签由 effect 持有，停用插件时整个移除。
  宿主若在某个版本改掉这两个类名，这两条会静默失效、图标退回默认色，其余部分不受影响。
- **品牌插槽按 `priority: -1` 覆盖**：single 插槽同一优先级只允许一个占用者，且**数值最小的渲染**。
  官方的 `@deepseek-ai/dsh-client-ui-brand-official` 已经以默认优先级 0 注册了两个座位：
  `sidebar.brand.mark`（鱼形标）和 `sidebar.brand.name`（DeepSeek Harness 字标）。
  本插件只把**图标**那个座位下沉一级遮住，**字标座位一个字节都不碰**，所以侧栏显示的是官方
  `BrandWordmark` 真迹；首页 `conversation.hero.brand.mark` 目前没有占用者，用同一个优先级保持一致。
  不写 priority 会和官方占用者撞成 `single slot ... already has a registration at priority 0`。
- **禁用即还原**：token 层、图标样式和两个插槽注册都由 effect 持有，停用插件后官方标识和原配色自动回来。

## 结构

| 路径 | 作用 |
|---|---|
| `package.json` | `dsh.bundle` 声明补丁层，`dsh.client` 声明浏览器半边 |
| `cordis.patch.yml` | 插入本插件的 loader 行，`disabled: true` 保持默认禁用 |
| `index.js` | Host 半边：不注册任何服务，只让 Loader 能解析本包 |
| `client.js` | 浏览器半边：调色板 + 新对话行图标染色 + 鲸鱼标识（`window.__ModuleLoader__` 产物，无构建步骤） |
| `locale/zh.json`、`locale/en.json` | 插件管理器里显示的名称与说明 |
| `icon.svg` | 插件图标（DeepSeek 鲸鱼标） |

## 与其它换肤插件共存

本插件只叠加主题 token。如果同时启用了别的换肤 / 背景插件（例如 `dsh-bg-theme`），
两者会各自往主题栈里压一层，后写入的一方覆盖同名 token：本插件负责底色、侧栏、气泡、代码块，
背景插件负责背景图与半透明面板，重叠的那几个 token 以最后压入的为准。
想固定用哪一套时，只启用其中一个最省事。

## 素材与商标

鲸鱼标的路径取自公开发布的 DeepSeek 品牌图标（[Simple Icons](https://simpleicons.org/icons/deepseek)
的 `deepseek` 条目，图标资产以 CC0 1.0 发布），没有改轮廓、没有重新描摹，只把填充色统一成品牌蓝
`#4D6BFE`。`client.js` 里的 `WHALE_PATH` 与 `icon.svg` 使用同一串路径数据。

鲸鱼图形本身是杭州深度求索人工智能基础技术研究有限公司的商标。本项目是非官方主题，仅把它用作界面上的
品牌标识，不代表、亦未获得深度求索的认可或背书。

## 许可

代码以 [MIT](../LICENSE) 发布，许可证全文在仓库根目录。商标不在此列，见上一节。
