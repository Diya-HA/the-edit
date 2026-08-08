import type { MetadataRoute } from "next";

/**
 * What "Add to Home Screen" gets you.
 *
 * The app is designed for a phone and shared as a link, so it should be
 * installable: standalone display means no browser chrome, and the icons and
 * colours below are what the home screen and the splash use. Without this the
 * URL opens in a tab that looks like a website of an app.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Edit",
    short_name: "The Edit",
    description: "One aesthetic, every brand.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    /* The app's own canvas and ink, from styles/design-system/tokens. The
       background is what the splash paints before the first render. */
    background_color: "#FFFFFF",
    theme_color: "#0E0E10",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
