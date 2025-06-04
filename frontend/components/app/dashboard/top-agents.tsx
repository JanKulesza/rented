"use client";
import { agencyContext } from "@/components/providers/agency-provider";
import { User } from "@/components/providers/auth-provider";
import { sort } from "fast-sort";
import { useContext } from "react";
import MiniCard from "./mini-card";

const TopAgents = () => {
  const { agency } = useContext(agencyContext);

  const sortedAgents = sort(agency.agents as User[])
    .desc((a) => a.sold)
    .slice(0, 4);
  return (
    <div className="flex flex-col gap-6">
      {sortedAgents.map((a) => (
        <MiniCard
          key={a._id}
          image={a.image?.url ?? ""}
          label={`${a.firstName} ${a.lastName}`}
          info={`${a.sold} properties sold`}
          href={`${agency._id}/agents/${a._id}`}
        />
      ))}
    </div>
  );
};

export default TopAgents;
