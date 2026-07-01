# 命格人格测试

一个参考 MBTI / SBTI 传播形式的娱乐化命格人格测试网站。项目使用 Next.js 构建，适配 Vercel 部署。

## 本地运行

```bash
pnpm install
pnpm dev
```

开发服务默认运行在本地 3000 端口。

## 生产构建

```bash
pnpm lint
pnpm build
pnpm start
```

## 页面

- `/` 首页
- `/test` 测试输入页
- `/result?type=quality` 结果页示例
- `/types` 全部标签
- `/characters` 命格人格卡展示
- `/about` 测试说明
- `/privacy` 隐私说明

## 隐私与免责声明

测试输入信息仅用于浏览器本地生成结果，不上传服务器，不保存到数据库。本测试仅供娱乐与自我观察，不构成心理、医学、法律、投资或人生决策建议。

## 图片资源

84 张完整命格人格卡位于：

```text
public/characters/destiny-card/cards/
```

图片已经包含中文名、英文名、关键词和底部文案，前端直接展示整张成品卡。

## 部署

查看 [DEPLOYMENT.md](./DEPLOYMENT.md)。
