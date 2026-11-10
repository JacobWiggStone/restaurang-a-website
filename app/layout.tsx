import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://restauranga.se"),

  applicationName: "Restaurang Å",

  title: {
    default: "Restaurang Å | Restaurang & lunch i Åkersberga",
    template: "%s | Restaurang Å i Åkersberga",
  },

  description:
    "Restaurang Å vid Åkersberga Golfklubb – lunch, middag, catering och konferens i Åkersberga. Stockholms bästa lunchrestaurang 2025 enligt Edenred.",

  authors: [
    {
      name: "Restaurang Å",
      url: "https://restauranga.se",
    },
  ],

  creator: "Restaurang Å",
  publisher: "Restaurang Å",

  alternates: {
    canonical: "/",
    languages: {
      "sv-SE": "/",
    },
  },

  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "/",
    siteName: "Restaurang Å",
    title: "Restaurang Å | Restaurang & lunch i Åkersberga",
    description:
      "Lunch, middag, catering, konferens och After Golf vid Åkersberga Golfklubb. Stockholms bästa lunchrestaurang 2025.",
    images: [
      {
        url: "/images/restaurang-a/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Restaurang Å vid Åkersberga Golfklubb i Åkersberga",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Restaurang Å | Restaurang & lunch i Åkersberga",
    description:
      "Lunch, middag, catering, konferens och After Golf vid Åkersberga Golfklubb.",
    images: ["/images/restaurang-a/hero.jpg"],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  category: "restaurant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={`${cormorant.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}