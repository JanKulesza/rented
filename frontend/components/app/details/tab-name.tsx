import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import FormInput from "@/components/inputs/form-input";
import { EditAgencyTabEnum } from "./edit-agency";

const TabName = () => {
  return (
    <TabsContent value={EditAgencyTabEnum.Name} className="flex flex-col">
      <div className="flex flex-1 justify-center items-center sm:w-8/10 mx-auto">
        <FormInput
          label="Name"
          name="name"
          className="w-full h-12"
          description="What's the name of your agency? 4-32"
          placeholder="Cosy apartment..."
        />
      </div>
    </TabsContent>
  );
};

export default TabName;
