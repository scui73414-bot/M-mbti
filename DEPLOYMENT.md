# 部署说明

## 1. 本地运行

```bash
pnpm install
pnpm dev
```

本地开发服务默认运行在 3000 端口。

## 2. 生产构建

```bash
pnpm lint
pnpm build
pnpm start
```

项目使用 Next.js。`pnpm lint` 当前执行 `tsc --noEmit`，用于检查 TypeScript 类型。

## 3. Vercel 部署步骤

1. 将项目推送到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 创建新项目，并选择该仓库。
3. Framework Preset 选择 `Next.js`。
4. Install Command 使用：

```bash
pnpm install --frozen-lockfile
```

5. Build Command 使用：

```bash
pnpm build
```

6. Output Directory 保持 Vercel 默认，不需要手动填写。
7. 部署后检查首页、测试页、结果页、标签页和隐私页。

项目已包含 `vercel.json`，Vercel 会优先读取其中的部署设置。

## 4. 环境变量说明

复制 `.env.example` 并按需配置：

```bash
cp .env.example .env.local
```

当前唯一可选变量：

```text
NEXT_PUBLIC_SITE_URL
```

用途：生成 metadata、Open Graph、robots 和 sitemap 的完整站点地址。

示例：

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

不要把任何真实密钥写进代码或提交到仓库。

## 5. 域名绑定说明

1. 在 Vercel 项目中打开 `Settings -> Domains`。
2. 添加你的域名。
3. 按 Vercel 提示配置 DNS。
4. 在 Vercel 环境变量中设置：

```text
NEXT_PUBLIC_SITE_URL=https://你的域名
```

5. 重新部署一次，让 sitemap、robots 和分享链接使用正式域名。

## 6. 图片资源目录说明

正式命格人格卡图片位于：

```text
public/characters/destiny-card/cards/
```

当前图片是完整成品卡，已经包含中文名、英文名、关键词和底部文案。前端会直接展示整张图片，不再叠加文字。

导入检查报告位于：

```text
public/characters/destiny-card/production-check-report.json
```

## 7. 上线前检查清单

- `pnpm lint` 通过。
- `pnpm build` 通过。
- 首页 `/` 正常。
- 测试页 `/test` 正常。
- 结果页 `/result?type=quality` 正常。
- 标签页 `/types` 正常。
- 隐私页 `/privacy` 正常。
- sitemap `/sitemap.xml` 可访问。
- robots `/robots.txt` 可访问。
- 84 张图片均能加载。
- 页面没有旧低多边形图片默认引用。
- 没有真实 API key、token 或私密信息提交到仓库。

## 8. 回滚方式

Vercel 会保留历史部署版本。

1. 打开 Vercel 项目。
2. 进入 `Deployments`。
3. 找到上一个稳定版本。
4. 点击 `Promote to Production`。

如果是代码问题，也可以回滚 Git 提交后重新部署。
