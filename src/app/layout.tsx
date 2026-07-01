import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mingge-personality.vercel.app";
const title = "命格人格测试";
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
    icon: "/favicon.svg",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    images: [
      {
        url: "/characters/destiny-card/cards/quality-card.png",
        width: 1080,
        height: 1440,
        alt: "命格人格测试结果卡",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/characters/destiny-card/cards/quality-card.png"],
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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
