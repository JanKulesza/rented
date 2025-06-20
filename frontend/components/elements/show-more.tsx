import { ReactNode, useState } from "react";
import { Button } from "../ui/button";

const ShowMore = ({ children }: { children: ReactNode }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="space-y-6">
      <div className={!showMore ? "line-clamp-5" : ""}>{children}</div>
      <Button onClick={() => setShowMore(!showMore)}>
        {showMore ? "Show less" : "Show more"}
      </Button>
    </div>
  );
};

export default ShowMore;
