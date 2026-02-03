import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn",
  description: "Trang thông tin nghĩa trang liệt sĩ xã Hương Sơn",
  icons: {
    icon: "/assets/emblem_of_vietnam.png",
    apple: "/assets/emblem_of_vietnam.png",
  },
  applicationName: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn",
  keywords: [
    "nghĩa trang liệt sĩ",
    "Hương Sơn",
    "tra cứu liệt sĩ",
    "thông tin mộ",
    "tưởng niệm",
  ],
  authors: [{ name: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn" }],
  creator: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn",
  publisher: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn",
  metadataBase: new URL("https://nghiatranglietsihuongson.vercel.app/" || "http://localhost:3000"),
  openGraph: {
    title: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn",
    description: "Trang thông tin nghĩa trang liệt sĩ xã Hương Sơn",
    type: "website",
    locale: "vi_VN",
    siteName: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn",
    images: [
      {
        url: "/assets/image.jpg",
        width: 1200,
        height: 630,
        alt: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nghĩa Trang Liệt Sĩ Xã Hương Sơn",
    description: "Trang thông tin nghĩa trang liệt sĩ xã Hương Sơn",
    images: ["/assets/image.jpg"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
