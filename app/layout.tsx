import type { Metadata } from "next";
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSans.variable} ${martianMono.variable} ${newsreader.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
