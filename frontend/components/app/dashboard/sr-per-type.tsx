"use client";
import {
  agencyContext,
  Property,
  PropertyTypes,
} from "@/components/providers/agency-provider";
import { Progress } from "@/components/ui/progress";
import { Dot } from "lucide-react";
import { Fragment, useContext } from "react";

const SRPerType = () => {
  const {
    agency: { properties },
  } = useContext(agencyContext);
  const TYPE_COLORS: Record<PropertyTypes, string> = {
    [PropertyTypes.APARTMENT]: "#6366F1", // indigo-500
    [PropertyTypes.STUDIO]: "#34D399", // emerald-400
    [PropertyTypes.HOUSE]: "#F472B6", // pink-400
    [PropertyTypes.VILLA]: "#38BDF8", // sky-400
    [PropertyTypes.CONDO]: "#A78BFA", // purple-400
    [PropertyTypes.TOWNHOUSE]: "#FBBF24", // amber-400
    [PropertyTypes.COMMERCIAL]: "#FB923C", // orange-400
    [PropertyTypes.INDUSTRIAL]: "#F87171", // red-400
    [PropertyTypes.WAREHOUSE]: "blue-400",
  };
  return (
    <div className="flex flex-col justify-between gap-4">
      {Object.values(PropertyTypes).map((pt) => {
        const p = (properties as Property[]).filter(
          (p) => p.propertyType === pt
        );
        const ps = p.filter((p) => p.isSold);
        const pDiff = p.length === 0 ? 0 : (ps.length / p.length) * 100;
        const color = TYPE_COLORS[pt];
        return (
          <Fragment key={pt}>
            <div className="flex items-center justify-between text-sm mb-0">
              <span className="flex items-center">
                {pt} <Dot />
                <span className="text-muted-foreground">{p.length} listed</span>
              </span>
              <span>{pDiff.toFixed()}%</span>
            </div>
            <Progress value={pDiff} className="bg-accent" color={color} />
          </Fragment>
        );
      })}
    </div>
  );
};

export default SRPerType;
