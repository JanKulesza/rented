"use client";
import { authContext } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Clipboard, Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const AddAgent = () => {
  const { agencyId } = useParams();
  const { fetchWithAuth } = useContext(authContext);
  const [url, setUrl] = useState("");

  useEffect(() => {
    (async () => {
      const { data, res } = await fetchWithAuth<{ token: string }>(
        `http://localhost:8080/api/agencies/${agencyId}/invitation-token`
      );

      if (res.ok) {
        setUrl(`http://localhost:3000/join-agency?token=${data.token}`);
      } else {
        toast.error("Couldn't generate invitation url.");
      }
    })();
  }, [url]);
  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => setUrl("")}>
        <Button>
          <Plus /> Add Agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Agent</DialogTitle>
          <DialogDescription>
            Send this link to the person you want to add as an agent.
          </DialogDescription>
        </DialogHeader>
        <div className="flex">
          <Input disabled value={url} className="overflow-auto" />
          <Button
            disabled={url.length === 0}
            variant="ghost"
            className="text-primary hover:text-primary hover:bg-muted/50 active:animate-button-pop "
            onClick={() => {
              navigator.clipboard.writeText(url);
            }}
          >
            <Clipboard /> Copy
          </Button>
        </div>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default AddAgent;
