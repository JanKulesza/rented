import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { Property } from "@/components/providers/agency-provider";
import { User } from "@/components/providers/auth-provider";
import { notFound, redirect } from "next/navigation";
import AgentChart from "@/components/app/agents/details/agent-chart";
import PropertyCarousel from "@/components/elements/property-carousel";
import BackButton from "@/components/elements/back-btn";
import { ChevronLeft, Dot } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const AgentDetailsPage = async ({
  params,
}: {
  params: Promise<{ agentId: string; agencyId: string }>;
}) => {
  const { agentId, agencyId } = await params;

  const res = await fetch(`http://localhost:8080/api/users/${agentId}`);

  if (!res.ok) {
    if (res.status === 500)
      return redirect(`/app/${agencyId}/agents?redirectStatus=500`);
    else return notFound();
  }

  const agent = (await res.json()) as User;

  const properties = agent.properties as Property[];
  const countSold = properties.filter((p) => p.isSold).length;

  const soldDiff = countSold > 0 ? (properties.length / countSold) * 100 : 0;

  return (
    <div className="space-y-6">
      <BackButton>
        <ChevronLeft /> {agent.firstName + " " + agent.lastName}
      </BackButton>
      <section className="flex max-sm:flex-col gap-6">
        <div className="w-full sm:w-1/2 lg:w-1/3 border bg-card rounded-2xl shadow-sm flex flex-col justify-between p-6 pt-12 gap-4">
          <div className="flex gap-2 items-center mb-3">
            <div className="aspect-square w-1/2 relative max-h-24 max-w-24 ">
              <Image
                fill
                className="rounded-full"
                src={agent.image.url}
                alt={agent.firstName + " " + agent.lastName}
              />
            </div>
            <div className="w-1/2">
              <h3 className="text-lg">
                {agent.firstName + " " + agent.lastName}
              </h3>
              <span className="text-muted-foreground">{agent.role}</span>
            </div>
          </div>
          <table className="w-full border-separate border-spacing-3 text-sm">
            {agent.agency &&
              typeof agent.agency === "object" &&
              "name" in agent.agency && (
                <tr>
                  <td className="text-muted-foreground">Agency:</td>
                  <td>{agent.agency.name}</td>
                </tr>
              )}
            <tr>
              <td className="text-muted-foreground">Joined at:</td>
              <td>{format(agent.createdAt, "dd MMMM yyyy")}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">City:</td>
              <td>{agent.address.city}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">State:</td>
              <td>{agent.address.state}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">Country:</td>
              <td>{agent.address.country}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">Zip code:</td>
              <td>{agent.address.zip}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">Email:</td>
              <td>{agent.email}</td>
            </tr>
            <tr>
              <td className="text-muted-foreground">Phone:</td>
              <td>{agent.phone}</td>
            </tr>
          </table>
          <div>
            <div className="flex items-center justify-between text-sm mb-0">
              <span className="flex items-center">
                Sold <Dot />
                <span className="text-muted-foreground">
                  {agent.properties.length} listed
                </span>
              </span>
              <span>{soldDiff.toFixed()}%</span>
            </div>
            <Progress
              value={soldDiff}
              className="bg-accent"
              color="var(--primary)"
            />
          </div>
        </div>
        <AgentChart properties={agent.properties as Property[]} />
      </section>
      <section className="bg-card shadow-sm border rounded-xl p-6">
        <PropertyCarousel properties={agent.properties as Property[]} />
      </section>
    </div>
  );
};

export default AgentDetailsPage;
