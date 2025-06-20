import DragZone from "@/components/elements/drag-zone";
import FormTextArea from "@/components/inputs/form-textarea";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TabEnum } from "./add-property";
import { TabsContent } from "@/components/ui/tabs";

const TabInfo = () => {
  return (
    <TabsContent value={TabEnum.Info} className="space-y-6">
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">Provide info</SheetTitle>
        <SheetDescription>Share some info about your place.</SheetDescription>
      </SheetHeader>
      <DragZone height={300} className="mb-5" />
      <FormTextArea
        label="Description"
        name="description"
        className="h-24"
        description="Write a short description for this listing"
        placeholder="This is cosy apartment located in..."
      />
    </TabsContent>
  );
};

export default TabInfo;
