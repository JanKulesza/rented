import { authContext } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Spinner from "@/components/ui/spinner";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";

const DeleteProperty = ({ propertyId }: { propertyId: string }) => {
  const { fetchWithAuth } = useContext(authContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { res } = await fetchWithAuth(
        `http://localhost:8080/api/properties/${propertyId}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        toast.success("Property deleted successfully.");
        router.back();
      } else {
        toast.error("Couldn't delete property. Please try again later.");
      }
    } catch {
      toast.error("Unexpected error occured. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="hover:flex-1 flex-none transition-all duration-500"
          variant="destructive"
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want delete this property?</DialogTitle>
          <DialogDescription>This action is irreversible</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-1/2" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className="w-1/2"
            variant="destructive"
          >
            {isLoading ? <Spinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProperty;
