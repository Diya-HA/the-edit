import type { Metadata, Viewport } from "next";
import {
  Archivo,
  Instrument_Sans,
  Martian_Mono,
  Newsreader,
} from "next/font/google";
import "@/styles/design-system/styles.css";
import "./globals.css";

/* The design system names these four families in tokens/fonts.css and
   loads them with an @import from Google Fonts. A remote @import nested
   inside the token manifest gets dropped when the CSS is bundled, so the
   app loads them here instead — self-hosted, which is what the design
   system's own notes ask for. tokens/extensions.css binds the results
   back onto --font-display / --font-sans / --font-mono / --font-serif. */

// Display: needs the width axis for the condensed 88–90% lockups.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
  display: "swap",
});

// Italic is the only cut the system uses, but the roman is needed for
// the variable font to load cleanly.
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Edit",
  description: "One aesthetic, every brand.",
  applicationName: "The Edit",
  /* The URL gets shared, so the unfurl is part of the product. The image
     itself is app/opengraph-image.tsx. */
  openGraph: {
    title: "The Edit",
    description: "One aesthetic, every brand.",
    siteName: "The Edit",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  /* Standalone, so "Add to Home Screen" opens without browser chrome. */
  appleWebApp: { capable: true, title: "The Edit", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  /* viewport-fit=cover is what makes the safe-area insets non-zero; without
     it the notch and the home indicator simply overlap the app. globals.css
     spends them on the shell. */
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E0E10",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSans.variable} ${martianMono.variable} ${newsreader.variable}`}
    >
      <head>
        {/* Every photograph comes from a brand's CDN rather than from us, so
            the first card cannot start downloading until a fresh TLS handshake
            has finished with a host the browser has never met. Opening those
            connections while the HTML is still parsing is worth about 300ms on
            a phone, measured. The two hosts are the ones in next.config's
            remotePatterns; a brand added outside them wants adding here too. */}
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="" />
        <link rel="preconnect" href="https://uskees.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
