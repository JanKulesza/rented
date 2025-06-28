"use client";
import { useContext } from "react";
import MiniCard from "./mini-card";
import {
  agencyContext,
  Property,
} from "@/components/providers/agency-provider";
import { sort } from "fast-sort";
import { formatAddress } from "@/lib/utils";

const LatestSales = () => {
  const { agency } = useContext(agencyContext);

  const latestSales = sort(
    (agency.properties as Property[]).filter((p) => p.isSold)
  )
    .desc((p) => p.updatedAt)
    .slice(0, 4);

  return (
    <>
      <div className="flex flex-col gap-6">
        {latestSales.map((p) => (
          <MiniCard
            key={p._id}
            image={p.image?.url ?? ""}
            label={p.name}
            info={formatAddress(p.address)}
            href={`${agency._id}/sales/${p._id}`}
          />
        ))}
      </div>
    </>
  );
};

export default LatestSales;
