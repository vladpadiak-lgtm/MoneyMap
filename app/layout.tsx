import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "cyrillic"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const image = new URL("/og.png", origin).toString();
  return {
    metadataBase: new URL(origin),
    title: { default: "MoneyMap", template: "%s — MoneyMap" },
    description: "Особисті фінанси без хаосу: транзакції, бюджети, цілі та зрозуміла аналітика.",
    applicationName: "MoneyMap",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "MoneyMap — гроші під контролем",
      description: "Транзакції, бюджети, цілі та зрозуміла аналітика в одному приватному просторі.",
      type: "website",
      locale: "uk_UA",
      images: [{ url: image, width: 1730, height: 877, alt: "MoneyMap — гроші під контролем" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "MoneyMap — гроші під контролем",
      description: "Особисті фінанси без хаосу.",
      images: [image],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
