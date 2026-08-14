import styles from "./Skeleton.module.css";

/**
 * The shapes a screen holds while it waits.
 *
 * Every screen here reads the database on the request, so there is a real gap
 * between tapping and seeing. A spinner in that gap says "something is
 * happening"; a skeleton says "here is what is coming", and the difference is
 * whether the wait feels like the app working or the app stalling.
 *
 * These match the real components' geometry exactly — the same aspect ratios,
 * the same two-column masonry dealt the same alternating way, the same gaps.
 * A skeleton that is nearly right is worse than none, because content jumps
 * when it lands and the jump is what people notice.
 */

/** One card: field, brand line, title, price. */
function PieceSkeleton({ aspect }: { aspect: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.field} style={{ aspectRatio: aspect }} />
      <div className={styles.brand} />
      <div className={styles.title} />
      <div className={styles.price} />
    </div>
  );
}

/* The same three shapes PieceGrid deals from, in a fixed rotation. Fixed
   rather than random so the skeleton is identical on server and client —
   a mismatch there is a hydration error, and the fix for that is not to
   randomise in the first place. */
const SHAPES = ["4 / 5", "1 / 1", "3 / 4", "1 / 1", "3 / 4", "4 / 5"];

/** The masonry, waiting. Two columns dealt alternately, as the real one is. */
export function PieceGridSkeleton({ count = 6 }: { count?: number }) {
  const columns: string[][] = [[], []];
  for (let i = 0; i < count; i += 1) {
    columns[i % 2].push(SHAPES[i % SHAPES.length]);
  }

  return (
    <div className={styles.grid} aria-hidden="true">
      {columns.map((column, i) => (
        <div key={i} className={styles.column}>
          {column.map((aspect, j) => (
            <PieceSkeleton key={j} aspect={aspect} />
          ))}
        </div>
      ))}
    </div>
  );
}

/** A single block of text, for headers and notes. */
export function LineSkeleton({ width = "60%" }: { width?: string }) {
  return <div className={styles.line} style={{ width }} aria-hidden="true" />;
}

/** The product detail hero and the block of type beneath it. */
export function ProductSkeleton() {
  return (
    <div className={styles.product} aria-hidden="true">
      <div className={styles.hero} />
      <div className={styles.body}>
        <div className={styles.brand} />
        <div className={styles.heading} />
        <div className={styles.price} />
        <div className={styles.paragraph} />
        <div className={styles.paragraphShort} />
        <div className={styles.button} />
      </div>
    </div>
  );
}

/** The two-across board grid. */
export function BoardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={styles.boards} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.board}>
          <div className={styles.cover} />
          <div className={styles.title} />
          <div className={styles.price} />
        </div>
      ))}
    </div>
  );
}
