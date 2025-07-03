import { User } from "@/components/providers/auth-provider";
import { capitalize } from "@/lib/utils";
import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import Image from "next/image";

const AgentCard = ({ agent }: { agent: User }) => {
  return (
    <div className="w-full flex max-[450px]:flex-col hover:shadow-xl transition-all duration-500 rounded-xl">
      <div className="aspect-square relative w-1/2 sm:w-1/3 min-w-52  max-h-56">
        <Image
          fill
          priority
          className="rounded-xl object-cover"
          src={agent.image.url}
          alt={agent.firstName + " " + agent.lastName}
        />
      </div>
      <div className="flex flex-col justify-between w-full p-4">
        <div className="mb-3">
          <h3 className="text-2xl">{agent.firstName + " " + agent.lastName}</h3>
          <span className="text-muted-foreground">
            {capitalize(agent.role)}
          </span>
        </div>
        <div className="flex max-sm:flex-col sm:flex-wrap gap-y-2 text-muted-foreground text-sm">
          <div className="flex gap-2 basis-1/2 items-center">
            <Mail strokeWidth={1.5} /> {agent.email}
          </div>
          <div className="flex gap-2 basis-1/2 items-center">
            <Phone strokeWidth={1.5} /> {agent.phone}
          </div>
          <div className="flex gap-2 basis-1/2 items-center">
            <MapPin strokeWidth={1.5} />{" "}
            {agent.address.city + ", " + agent.address.country}
          </div>
          <div className="flex gap-2 basis-1/2 items-center">
            <Building2 strokeWidth={1.5} /> {agent.properties.length} properties
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
