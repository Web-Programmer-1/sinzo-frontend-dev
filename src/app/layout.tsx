import { Metadata } from "next";
import Providers from "./providers";
import { Roboto } from "next/font/google";
import "./globals.css";
import MetaPixel from "../components/meta/metaPixel";
import GoogleAnalytics from "../components/meta/googleAnalytics";
import JsonLdStore from "../components/meta/JsonLdStore";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "Sinzo Official | Best E-Commerce Shopping Platform in Bangladesh",
    template: "%s | Sinzo Official",
  },
  description:
    "Sinzo Official (sinzooffcial) - Best e-commerce shopping platform in Bangladesh. Buy wood products, furniture, decor and more online.",
  keywords: [
    "sinzoofficial",
    "sinzo official",
    "sinzo shop",
    "sinzo shop bd",
    "সিনজো শপ",
    "সিনজো অফিশিয়াল",
    "e-commerce bangladesh",
    "online shop bangladesh",

  ],
  authors: [{ name: "Sinzo Official BD", url: "https://sinzooffcial.com" }],
  creator: "Sinzo Official BD",
  publisher: "Sinzo Official BD",
  metadataBase: new URL("https://sinzooffcial.com"),
  alternates: {
    canonical: "https://sinzooffcial.com",
  },
  icons: {
    icon: "/banners/sinzo.jpg",
    shortcut: "/banners/sinzo.jpg",
    apple: "/banners/sinzo.jpg",
  },
  openGraph: {
    title: "Sinzo Official - Best E-Commerce Shopping Platform in Bangladesh",
    description:
      "Sinzo Official (sinzooffcial) - Best e-commerce shopping platform in Bangladesh.",
    url: "https://sinzooffcial.com",
    siteName: "Sinzo Official BD",
    type: "website",
    images: [
      {
        url: "/banners/sinzo.jpg",
        width: 1200,
        height: 630,
        alt: "Sinzo Official BD",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinzo Official BD | sinzooffcial",
    description:
      "Sinzo Official (sinzooffcial) - Best e-commerce shopping platform in Bangladesh.",
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
        <JsonLdStore />
        <MetaPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}