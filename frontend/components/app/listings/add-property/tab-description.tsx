import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import React from "react";
import { TabEnum } from "./add-property";
import { TabsContent } from "@/components/ui/tabs";
import FormTextArea from "@/components/inputs/form-textarea";

const TabDescription = () => {
  return (
    <TabsContent value={TabEnum.Description} className="flex flex-col">
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">Write description</SheetTitle>
        <SheetDescription>
          Tell us something about this property.
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-1 justify-center items-center sm:w-8/10 mx-auto">
        <FormTextArea
          label="Description"
          name="description"
          className="h-44 w-full"
          description="Write a short description for this listing. 5-500"
          placeholder="This is cosy apartment located in..."
        />
      </div>
    </TabsContent>
  );
};

export default TabDescription;
