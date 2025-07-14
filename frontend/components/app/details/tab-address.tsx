import { TabsContent } from "@/components/ui/tabs";
import FormInput from "@/components/inputs/form-input";
import { useFormContext } from "react-hook-form";
import { EditAgencyTabEnum } from "./edit-agency";
import useMap from "@/components/elements/map";

const TabAddress = ({
  setLocationCorrect,
}: {
  setLocationCorrect: (correct: boolean) => void;
}) => {
  const form = useFormContext();
  const Map = useMap();
  return (
    <TabsContent value={EditAgencyTabEnum.Address}>
      <div className="flex max-md:flex-col gap-6">
        <div className="md:w-2/3 space-y-6 ">
          <FormInput
            name="address.address"
            label="Address"
            placeholder="Address"
          />
          <FormInput
            name="address.suite"
            label="Suite"
            placeholder="Suite (optional)"
          />
          <FormInput name="address.city" label="City" placeholder="City" />
          <FormInput name="address.state" label="State" placeholder="State" />
          <FormInput
            name="address.country"
            label="Country"
            placeholder="Country"
          />
          <FormInput
            name="address.zip"
            label="Zip Code"
            placeholder="Zip Code"
          />
        </div>
        <Map
          startPosition={[52.23, 21.01]}
          addr={form.watch("address")}
          useRecenter
          height="475px"
          onRecenter={(location) => {
            if (!location) setLocationCorrect(false);
            else {
              form.setValue("address.lat", +location.lat);
              form.setValue("address.lon", +location.lon);
              setLocationCorrect(true);
            }
          }}
        />
      </div>
    </TabsContent>
  );
};

export default TabAddress;
