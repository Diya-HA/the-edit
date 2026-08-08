import { ImageResponse } from "next/og";

/**
 * What a shared link looks like.
 *
 * The URL is going to get passed around, and an unfurl with no image is a grey
 * box with a domain in it. This is the wordmark and the promise, set the way
 * the app sets them: black display type on white, one line of the idea beneath.
 */
export const alt = "The Edit — one aesthetic, every brand";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#FFFFFF",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 148,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            color: "#0E0E10",
            lineHeight: 1,
          }}
        >
          THE EDIT
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 44,
            color: "#57575C",
            letterSpacing: "-0.01em",
          }}
        >
          One aesthetic, every brand.
        </div>
      </div>
    ),
    size,
  );
}
