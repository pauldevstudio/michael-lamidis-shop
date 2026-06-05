import { Star } from "lucide-react";

/**
 * Premium star rating with fractional fill (e.g. 4.7 shows a 70%-filled 5th
 * star). Pure presentational — pass a rating 0–5.
 */
export default function StarRating({
  rating,
  size = 14,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-[3px] ${className}`}
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              className="absolute inset-0 text-navy-200"
              style={{ width: size, height: size }}
              strokeWidth={1.5}
            />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star
                className="text-amber-400 fill-amber-400"
                style={{ width: size, height: size }}
                strokeWidth={1.5}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}
