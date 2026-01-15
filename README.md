# robo-eyes

FluxGarage RoboEyes Web Port - 一个基于 Web 的机器人眼睛动画系统

## 简介

这是 [FluxGarage RoboEyes](https://github.com/FluxGarage/RoboEyes) 库的 Web 版本实现。原版是一个用于 Arduino OLED 显示屏的机器人眼睛动画库，本项目将其移植到了 Web 平台。

## 功能特性

- ✅ 流畅的眼睛动画系统
- ✅ 多种情绪表达（Mood）：DEFAULT, HAPPY, TIRED, ANGRY, SUSPICIOUS, SERIOUS, IRRITATED, SAD, HAPPYBLUSH
- ✅ 8 个方向的位置控制（N, NE, E, SE, S, SW, W, NW）
- ✅ 自动眨眼（Autoblink）
- ✅ 空闲模式（Idle Mode）- 随机移动眼睛位置
- ✅ 动画效果：Laugh（笑）、Confused（困惑）、Flicker（闪烁）
- ✅ Curiosity 模式 - 当眼睛移动到极左/极右时，外侧眼高度增加
- ✅ 多种颜色选择
- ✅ 平滑的动画过渡

## 技术栈

- 原生 JavaScript (ES6+)
- Canvas 2D API
- Vite 构建工具

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 使用说明

1. **Mood（情绪）**：点击不同的情绪按钮来改变眼睛的形状和表情
2. **Position（位置）**：点击方向按钮让眼睛"看"向不同方向
3. **Actions（动作）**：
   - Open：睁开眼睛
   - Close：闭上眼睛
   - Blink：眨眼
4. **Animations（动画）**：
   - Laugh：眼睛上下抖动（笑）
   - Confused：眼睛左右抖动（困惑）
   - Flicker：眼睛随机闪烁
5. **Colors（颜色）**：选择不同的眼睛颜色
6. **Options（选项）**：
   - Autoblink：自动眨眼开关
   - Idle：空闲模式开关（随机移动眼睛）

## 项目结构

```
robo-eyes/
├── src/
│   ├── core/
│   │   ├── AnimationSystem.js    # 动画系统
│   │   └── EyeRenderer.js        # 眼睛渲染器
│   ├── eyes/
│   │   └── EyeController.js      # 眼睛控制器
│   ├── effects/
│   │   └── EffectsManager.js     # 特效管理器
│   ├── utils/
│   │   └── helpers.js            # 工具函数
│   └── main.js                   # 主入口
├── index.html                    # HTML 入口
├── vite.config.js                # Vite 配置
└── package.json                  # 项目配置
```

## 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署。按照以下步骤操作：

### 1. 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. 在 **Source** 部分，选择 **GitHub Actions**
4. 保存设置

### 2. 调整 base 路径（如果需要）

如果你的仓库名称不是 `robo-eyes`，需要修改 `vite.config.js` 中的 `base` 配置：

```javascript
export default defineConfig({
  base: '/你的仓库名称/',  // 修改这里
  // ...
})
```

如果部署到 `username.github.io`（用户主页），base 应该设置为 `'/'`。

### 3. 推送代码

将代码推送到 `main` 分支后，GitHub Actions 会自动：
- 安装依赖
- 构建项目
- 部署到 GitHub Pages

### 4. 访问网站

部署完成后，你的网站地址将是：
- `https://你的用户名.github.io/robo-eyes/`（如果仓库名为 robo-eyes）
- 或 `https://你的用户名.github.io/`（如果部署到用户主页）

首次部署可能需要几分钟时间，之后每次推送到 main 分支都会自动更新。

## 参考

- [FluxGarage RoboEyes](https://github.com/FluxGarage/RoboEyes) - 原始 Arduino 库

## 许可证

MIT License
