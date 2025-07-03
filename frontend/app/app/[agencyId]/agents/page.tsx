"use client";
import AddAgent from "@/components/app/agents/add-agent";
import AgentCard from "@/components/app/agents/agent-card";
import { agencyContext } from "@/components/providers/agency-provider";
import { authContext, User } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

const PageAgents = () => {
  const pathname = usePathname();
  const { user } = useContext(authContext);
  const userId = user?._id;
  const { agency } = useContext(agencyContext);
  const [agents, setAgents] = useState(agency.agents as User[]);
  const [name, setName] = useState("");
  const nameInput = useRef<HTMLInputElement>(null);

  const handleSearchName = () => setName(nameInput.current?.value ?? "");

  useEffect(() => {
    if (name)
      setAgents(
        (agency.agents as User[]).filter((a) =>
          `${a.firstName} ${a.lastName}`.includes(name)
        )
      );
  }, [name]);
  return (
    <div className="flex flex-col gap-6 max-sm:px-2">
      <div className="flex max-sm:flex-col w-full gap-2 justify-between">
        <div className="flex shadow-xs rounded-md h-9 overflow-hidden border-input border">
          <Input
            placeholder="Name"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchName();
            }}
            ref={nameInput}
            className="shadow-none rounded-none border-none focus-visible:ring-0"
          />
          <Button
            onClick={handleSearchName}
            size="icon"
            variant="ghost"
            className="text-muted-foreground h-full border-l border-l-input shadow-none rounded-l-none overflow-hidden rounded-r"
          >
            <Search />
          </Button>
        </div>
        <AddAgent />
      </div>
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
