# DAIZY

基于 macOS Big Sur 蓝色波浪视觉研究实现的 **全屏动态落地页**。

使用 Canvas 2D API 实时绘制多层贝塞尔曲线波浪动画，配合渐变填充与高斯模糊，呈现流畅而沉浸的视觉效果。

## 预览

启动开发服务器后访问 `http://localhost:3000`，即可看到带有全屏蓝色波浪动画背景的 DAIZY 品牌页面。

## 技术栈

| 技术 | 版本 |
| --- | --- |
| [Next.js](https://nextjs.org/) (App Router) | 15.2.9 |
| [React](https://react.dev/) | 19.0.4 |
| [TypeScript](https://www.typescriptlang.org/) | 5.8.2 |
| 包管理器 | [Bun](https://bun.sh/) 1.1.36 |

## 目录结构

```
DAIZY/
├── app/
│   ├── layout.tsx           # 根布局，全局 CSS 引入，lang="zh-CN"
│   ├── page.tsx             # 首页入口，渲染品牌名 + 波浪背景
│   └── globals.css          # 全局样式与 CSS 变量
├── components/
│   └── wave-background.tsx  # 核心组件：Canvas 多层正弦波浪动画
├── public/
│   ├── favicon.svg          # 站点图标
│   └── robots.txt           # 搜索引擎爬虫规则
├── bigsur_waves_blue.html   # 波浪效果独立 HTML 原型
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 快速开始

### 环境要求

- **Node.js** >= 18.17
- **Bun** >= 1.1（推荐）或 npm / pnpm / yarn

### 安装依赖

```bash
bun install
```

或使用 npm：

```bash
npm install
```

### 开发模式

```bash
bun run dev
```

默认启动在 `http://localhost:3000`。

### 生产构建

```bash
bun run build
bun run start
```

### 代码检查

```bash
bun run lint
```

## 核心架构

### 波浪动画（`wave-background.tsx`）

- **渲染方式**：全屏 `<canvas>` 元素 + `requestAnimationFrame` 驱动的 60fps 动画
- **波浪层数**：6 层独立波浪，每层拥有不同的基准高度、振幅、速度和频率参数
- **曲线算法**：多段贝塞尔曲线拼接，叠加三组正弦/余弦函数（主频、次频、三次频）
- **视觉效果**：线性渐变填充 + Canvas 高斯模糊滤镜
- **性能优化**：DPR 限制为 2x、分段数为 5 以平衡精度与性能
- **响应式**：监听 `resize` 事件自动适配窗口尺寸

### 可调参数

在 `wave-background.tsx` 的 `config` 对象中可以调整以下参数：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `blur` | 41 | 模糊程度 (0–100) |
| `amplitude` | 89 | 波浪振幅 (0–100) |
| `offset` | 28 | 波浪垂直偏移 (0–100) |
| `rotation` | 0 | 旋转角度 (度) |
| `speed` | 50 | 动画速度 (0–100) |

## 自定义

### 修改品牌名称

编辑 `app/page.tsx` 中 `.brand-chip` 内的文本。

### 修改配色

波浪颜色在 `components/wave-background.tsx` 的 `colors` 数组中定义，每层为一组 `[起始色, 结束色]` 的渐变。

### 添加中心图片

`page.tsx` 中包含被注释的居中图片组件，取消注释并在 `public/` 中放置对应图片即可启用。

## License

Private project.
