/**
 * What does this photograph look like at its edges?
 *
 * Two numbers come out of it. The first is the background colour, which the
 * card paints behind the picture so the two meet without a seam — the reason
 * a feed of five brands can look like one hand chose it despite every brand
 * shooting on a slightly different white. The second is how packshot-like the
 * picture is, which decides both which of a brand's images to use and which
 * pieces to lead with on the surfaces that mix aesthetics.
 *
 * Server-only: it downloads images and decodes them with sharp. Nothing that
 * runs in a browser may import this.
 */
import sharp from "sharp";

export type Measurement = {
  /** Mean colour of the image's border, as #rrggbb. */
  bgHex: string;
  /** 0-100. High means a uniform light ground with the garment isolated. */
  packshotScore: number;
  /** Share of the frame that is not background, 0-1. */
  coverage: number;
};

/**
 * Below this share of the frame, whatever is in the picture is not a garment
 * being photographed. Brands publish size charts, care symbols and technical
 * line drawings alongside their photography, and those score as flawless
 * packshots on the border test alone — a uniform white edge is exactly what a
 * schematic has. A real packshot has a garment occupying a good part of the
 * frame; a line drawing is nearly all paper.
 */
const MIN_COVERAGE = 0.1;

/** At or above this, a picture is a packshot for every purpose here. */
export const PACKSHOT = 70;

/** Ask the CDN for a small copy — the border does not need resolution. */
function atWidth(url: string, width: number): string {
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

export async function measureImage(
  url: string,
  timeoutMs = 8000,
): Promise<Measurement | null> {
  let bytes: ArrayBuffer;
  try {
    const res = await fetch(atWidth(url, 64), {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    bytes = await res.arrayBuffer();
  } catch {
    return null;
  }

  let data: Buffer;
  let info: { width: number; height: number; channels: number };
  try {
    const out = await sharp(Buffer.from(bytes))
      .resize(48, 48, { fit: "fill" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    data = out.data;
    info = out.info;
  } catch {
    return null;
  }

  const { width: w, height: h, channels: c } = info;
  const at = (x: number, y: number) => {
    const i = (y * w + x) * c;
    return [data[i], data[i + 1], data[i + 2]] as const;
  };

  /* The one-pixel border only. A packshot's border is the seamless paper it
     was shot on; a lifestyle shot's border is whatever was behind the model. */
  const edge: (readonly [number, number, number])[] = [];
  for (let x = 0; x < w; x += 1) {
    edge.push(at(x, 0));
    edge.push(at(x, h - 1));
  }
  for (let y = 1; y < h - 1; y += 1) {
    edge.push(at(0, y));
    edge.push(at(w - 1, y));
  }

  const mean = [0, 1, 2].map(
    (ch) => edge.reduce((s, p) => s + p[ch], 0) / edge.length,
  );
  /* Mean distance from that mean — how much the border varies. */
  const spread =
    edge.reduce(
      (s, p) => s + Math.hypot(p[0] - mean[0], p[1] - mean[1], p[2] - mean[2]),
      0,
    ) / edge.length;
  const lum = 0.2126 * mean[0] + 0.7152 * mean[1] + 0.0722 * mean[2];

  /* How much of the frame is something other than the background. Counted
     over the whole image, not the border, because this is the question the
     border cannot answer: is there a garment here at all? */
  let ink = 0;
  let total = 0;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const p = at(x, y);
      const d = Math.hypot(p[0] - mean[0], p[1] - mean[1], p[2] - mean[2]);
      if (d > 28) ink += 1;
      total += 1;
    }
  }
  const coverage = ink / total;

  /* Uniformity is the signal; lightness is the qualifier. A uniform *dark*
     border is usually a tight crop or a shadow, not a packshot, so it scores
     low even though it is even. An almost empty frame is a diagram and scores
     nothing at all, however clean its edges. */
  const uniformity = Math.max(0, 100 - spread * 2.5);
  const lightness = lum >= 200 ? 1 : lum >= 170 ? 0.6 : 0.2;
  const hasSubject = coverage >= MIN_COVERAGE ? 1 : 0;

  return {
    bgHex:
      "#" +
      mean.map((v) => Math.round(v).toString(16).padStart(2, "0")).join(""),
    packshotScore: Math.round(uniformity * lightness * hasSubject),
    coverage: Math.round(coverage * 1000) / 1000,
  };
}

/**
 * Choose the picture to show from everything a brand published for a piece.
 *
 * The brand's first image is its hero shot, which for an editorial label is a
 * model in a field. Where a packshot exists further down the list, that is the
 * one the feed wants. Where none does, the hero shot stands — a poor packshot
 * is worse than a good photograph.
 */
export async function chooseImage(
  urls: string[],
  limit = 4,
): Promise<{ url: string; measurement: Measurement | null }> {
  const candidates = urls.slice(0, limit);
  if (candidates.length === 0) return { url: "", measurement: null };

  /* Measured in the brand's own order, stopping at the first packshot. Most
     brands put theirs first, so this usually costs one request rather than
     four — which matters when it runs over a whole catalogue. */
  const measured: { url: string; m: Measurement | null }[] = [];
  for (const url of candidates) {
    const m = await measureImage(url);
    measured.push({ url, m });
    if (m && m.packshotScore >= PACKSHOT) return { url, measurement: m };
  }

  /* No packshot among them. Take the brand's own first choice — but not if it
     is a diagram, which is the one thing worse than a lifestyle shot. */
  const withSubject = measured.find(
    (x) => x.m === null || x.m.coverage >= MIN_COVERAGE,
  );
  const fallback = withSubject ?? measured[0];
  return { url: fallback.url, measurement: fallback.m };
}
