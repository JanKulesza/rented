import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { EditAgencyTabEnum } from "./edit-agency";
import DragZone from "@/components/elements/drag-zone";

const TabImage = () => {
  return (
    <TabsContent value={EditAgencyTabEnum.Image} className="flex flex-col">
      <div className="flex flex-col flex-1 w-1/2 justify-center items-center mx-auto">
        <DragZone ratio={1 / 1} className="rounded-full" />
      </div>
    </TabsContent>
  );
};

export default TabImage;
