import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        const className = `w-3.5 h-3.5 ${
          isFull || isHalf
            ? "text-amber-400"
            : "text-gray-300 dark:text-gray-600"
        }`;

        if (isFull) return <StarIcon key={i} className={className} />;
        if (isHalf) return <StarHalfIcon key={i} className={className} />;
        return <StarBorderIcon key={i} className={className} />;
      })}
    </div>
  );
};

export default StarRating;
