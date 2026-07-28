import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { brand } from "@/config/brand";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mingge-personality.vercel.app";
const title = `${brand.nameCn}｜东方命格人格测试`;
const description =
  "用本地生辰信息生成你的娱乐化命格人格卡，探索 84 种适合分享的命格人格标签。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description,
  applicationName: title,
  keywords: ["命格人格测试", "人格测试", "命运卡", "MBTI", "SBTI", "八字娱乐测试"],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>
        <div className="flex min-h-dvh flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
