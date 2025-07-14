"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Agency, agencyContext } from "@/components/providers/agency-provider";
import { ReactNode, useContext, useState } from "react";
import { authContext } from "@/components/providers/auth-provider";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import "leaflet/dist/leaflet.css";
import {
  EditAgencySchema,
  editAgencyShema,
} from "@/components/auth/create-agency-schema";
import TabName from "./tab-name";
import TabAddress from "./tab-address";
import TabImage from "./tab-image";
import { addressSchema } from "../listings/add-property/add-property-schema";

interface EditAgencyProps {
  children: ReactNode;
}

export enum EditAgencyTabEnum {
  Name = "name",
  Address = "address",
  Image = "image",
}

const tabEnumArr = Object.values(EditAgencyTabEnum);

const EditAgency = ({ children }: EditAgencyProps) => {
  const { agency, setAgency } = useContext(agencyContext);
  const { fetchWithAuth } = useContext(authContext);

  const [tab, setTab] = useState<EditAgencyTabEnum>(EditAgencyTabEnum.Name);
  const [isOpen, setIsOpen] = useState(false);
  const [locationCorrect, setLocationCorrect] = useState(false);

  const form = useForm<EditAgencySchema>({
    resolver: zodResolver(editAgencyShema),
    defaultValues: {
      address: agency.address,
      name: agency.name,
    },
  });

  const onSubmit = async (values: EditAgencySchema) => {
    const previousAgency = { ...agency };
    setAgency({
      ...agency,
      ...values,
      image: values.image
        ? { id: "", url: URL.createObjectURL(values.image) }
        : agency.image,
    });
    setIsOpen(false);
    try {
      const formData = new FormData();
      if (values.name && values.name !== agency.name)
        formData.append("name", values.name);
      if (values.address)
        Object.entries(values.address!).forEach(([field, val]) => {
          formData.append(`address[${field}]`, String(val));
        });
      if (values.image) {
        formData.append("image", values.image);
      }
      const { res, data } = await fetchWithAuth<Agency>(
        `http://localhost:8080/api/agencies/${agency._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (res.ok) {
        setAgency(data);
        form.reset();
        toast.success("Agency edited successfully!");
      } else {
        setAgency(previousAgency);
        if ("formErrors" in data) {
          setIsOpen(true);
          toast.error(`Invalid form data. Please check your inputs.`);
        } else if ("error" in data && typeof data.error === "string")
          toast.error(data.error);
        else toast.error("Unexpected error occured. Please try again later.");
      }
    } catch {
      setAgency(previousAgency);
      toast.error("Unexpected error occured. Please try again later.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-9/10 sm:w-4/5 md:w-4/5 lg:w-3/5 sm:max-w-9/10 pt-6 px-6">
        <SheetHeader className="mb-3 px-0">
          <SheetTitle className="text-2xl">Edit agency</SheetTitle>
          <SheetDescription>
            Here you can edit the details of your agency. This action is
            irreversible.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 h-full relative"
          >
            <Tabs
              value={tab}
              className="overflow-y-auto flex-1 h-[calc(100% - 7rem)]"
            >
              <TabName />
              <TabAddress setLocationCorrect={setLocationCorrect} />
              <TabImage />
            </Tabs>
            <SheetFooter className="px-0 h-28 flex-none">
              <Progress
                className="w-full mb-3"
                value={
                  (100 / tabEnumArr.length) * (tabEnumArr.indexOf(tab) + 1)
                }
              />
              <div className="flex justify-between">
                <Button
                  variant="secondary"
                  disabled={tab === tabEnumArr[0]}
                  onClick={(e) => {
                    e.preventDefault();
                    setTab(tabEnumArr[tabEnumArr.indexOf(tab) - 1]);
                  }}
                >
                  Previous
                </Button>
                {tab === tabEnumArr[tabEnumArr.length - 1] ? (
                  <Button type="submit">Edit Agency</Button>
                ) : (
                  <Button
                    type="button"
                    disabled={((): boolean => {
                      switch (tab) {
                        case EditAgencyTabEnum.Name:
                          const name = form.watch("name");

                          const { success: sName } = editAgencyShema
                            .pick({ name: true })
                            .safeParse({ name });

                          if (!sName) return true;
                          break;
                        case EditAgencyTabEnum.Address:
                          if (
                            !addressSchema.safeParse(form.watch("address"))
                              .success ||
                            !locationCorrect
                          )
                            return true;
                          break;

                        default:
                          break;
                      }

                      return false;
                    })()}
                    onClick={(e) => {
                      e.preventDefault();
                      setTab(tabEnumArr[tabEnumArr.indexOf(tab) + 1]);
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditAgency;
