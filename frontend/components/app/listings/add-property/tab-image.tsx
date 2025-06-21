import DragZone from "@/components/elements/drag-zone";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { TabEnum } from "./add-property";
import { TabsContent } from "@/components/ui/tabs";

const TabImage = () => {
  return (
    <TabsContent value={TabEnum.Image} className="flex flex-col">
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">Upload property photo</SheetTitle>
        <SheetDescription>
          This will be used as main property photo.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-1 justify-center items-center w-full">
        <DragZone className="mb-5 w-full" />
      </div>
    </TabsContent>
  );
};

export default TabImage;
