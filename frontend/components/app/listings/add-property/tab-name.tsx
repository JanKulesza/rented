import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import React from "react";
import { TabEnum } from "./add-property";
import { TabsContent } from "@/components/ui/tabs";
import FormInput from "@/components/inputs/form-input";

const TabName = () => {
  return (
    <TabsContent value={TabEnum.Name} className="flex flex-col">
      <SheetHeader className="mb-3 px-0">
        <SheetTitle className="text-2xl">
          It&apos;s time to choose a name for your property
        </SheetTitle>
        <SheetDescription>Short name works the best.</SheetDescription>
      </SheetHeader>
      <div className="flex flex-1 justify-center items-center sm:w-8/10 mx-auto">
        <FormInput
          label="Name"
          name="name"
          className="w-full h-12"
          description="Write a short name for this listing. 4-32"
          placeholder="Cosy apartment..."
        />
      </div>
    </TabsContent>
  );
};

export default TabName;
