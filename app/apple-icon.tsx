import { ImageResponse } from "next/og";

/**
 * The home-screen icon on iOS, which is where this app is meant to live.
 *
 * iOS rounds the corners itself and does not composite transparency, so this
 * fills the square edge to edge and lets the system mask it.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: "-0.06em",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        E
      </div>
    ),
    size,
  );
}
