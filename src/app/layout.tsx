import { Metadata } from "next";
import Providers from "./providers";
import { Roboto } from "next/font/google";
import "./globals.css";
import MetaPixel from "../components/meta/metaPixel";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: " Sinzo-Official",
  description:
    "sinzooffcial - Best e-commerce shopping platform in Bangladesh. Buy wood products, furniture and more.",
  keywords: [
    "sinzoofficial",
    "sinzo shop",
    "sinzo shop bd",
    "সিনজো শপ",
    "e-commerce bangladesh",
    "online shop bangladesh",
  ],
  authors: [{ name: "Sinzo Shop BD", url: "https://www.sinzooffcial.com" }],
  creator: "Sinzo Shop BD",
  publisher: "Sinzo Shop BD",
  metadataBase: new URL("https://sinzooffcial.com"),
  alternates: {
    canonical: "https://www.sinzooffcial.com",
  },
  icons: {
    icon: "/banners/sinzo.jpg",
    shortcut: "/banners/sinzo.jpg",
    apple: "/banners/sinzo.jpg",
  },
  openGraph: {
    title: "Sinzo sinzooffcial",
    description:
      "Sinzo Shop BD (sinzooffcial) - Best e-commerce shopping platform in Bangladesh.",
    url: "https://www.sinzooffcial.com",
    siteName: "Sinzo Shop BD",
    type: "website",
    images: [
      {
        url: "/banners/sinzo.jpg",
        width: 1200,
        height: 630,
        alt: "Sinzo Shop BD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinzo Shop BD | sinzooffcial",
    description:
      "Sinzo Shop BD (sinzooffcial) - Best e-commerce shopping platform in Bangladesh.",
    images: ["/banners/sinzo.jpg"],
  },
  verification: {
    google: "t-9rmkJsXhaFSRhufoG0jDraI-8tHflunwmiNhtNjcs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} ${roboto.variable}`} suppressHydrationWarning>
        <Providers>{children}</Providers>
        <MetaPixel />
      </body>
    </html>
  );
}