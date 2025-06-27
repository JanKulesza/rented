"use client";
import AgentCard from "@/components/app/agents/agent-card";
import { agencyContext } from "@/components/providers/agency-provider";
import { authContext, User } from "@/components/providers/auth-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const PageAgents = () => {
  const pathname = usePathname();
  const { user } = useContext(authContext);
  const { agency } = useContext(agencyContext);
  const userId = user?._id;
  const agents = agency.agents as User[];
  return (
    <div className="space-y-5">
      {agents.map((a) => (
        <Link
          key={a._id}
          href={userId !== a._id ? `${pathname}/${a._id}` : "/me"}
        >
          <AgentCard agent={a} />
        </Link>
      ))}
    </div>
  );
};

export default PageAgents;
