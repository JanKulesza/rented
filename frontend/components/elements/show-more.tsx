import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const ShowMore = ({ children }: { children: string }) => {
  const [showMore, setShowMore] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      const isOverflowing = el.scrollHeight > el.clientHeight;
      setIsClamped(isOverflowing);
    }
  }, [children]);

  return (
    <div className="space-y-6">
      <div ref={contentRef} className={`${!showMore ? "line-clamp-5" : ""}`}>
        <p>{children}</p>
      </div>
      {isClamped && (
        <Button onClick={() => setShowMore(!showMore)}>
          {showMore ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
};

export default ShowMore;
