import { ImageResponse } from "next/og";

/**
 * The app icon, drawn rather than shipped as a binary.
 *
 * The wordmark is THE EDIT set in condensed black display type on white. At
 * 512px that reads; at the 32px a browser tab actually uses it does not, so
 * the icon is the initial alone, ink-filled — the same relationship the
 * lockup has to the page.
 */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E0E10",
          color: "#FFFFFF",
          fontSize: 340,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          /* No web font is loaded here — a remote fetch at icon-render time is
             a dependency this does not need. The stack lands on a grotesque on
             every platform that will render it. */
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        E
      </div>
    ),
    size,
  );
}
