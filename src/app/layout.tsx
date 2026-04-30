import { Metadata } from "next";
import Providers from "./providers";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: " Sinzo-Offcial",
  description:
    "Sinzo Shop BD (sinzooffcial) - Best e-commerce shopping platform in Bangladesh. Buy wood products, furniture and more.",
  keywords: [
    "sinzooffcial",
    "sinzo shop",
    "sinzo shop bd",
    "সিনজো শপ",
    "e-commerce bangladesh",
    "online shop bangladesh",
  ],
  authors: [{ name: "Sinzo Shop BD", url: "https://www.sinzooffcial.com" }],
  creator: "Sinzo Shop BD",
  publisher: "Sinzo Shop BD",
  metadataBase: new URL("https://www.sinzooffcial.com"),
  alternates: {
    canonical: "https://www.sinzooffcial.com",
  },
  icons: {
    icon: "/banners/sinzo.jpg",
    shortcut: "/banners/sinzo.jpg",
    apple: "/banners/sinzo.jpg",
  },
  openGraph: {
    title: "Sinzo Shop BD | sinzooffcial",
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
      <body className={poppins.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}