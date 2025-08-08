"use client";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SearchPropertiesSchema,
  searchPropertiesSchema,
} from "@/shemas/search-properties-schema";
import FormInput from "../inputs/form-input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchProperties = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const inputBaseClass =
    "gap-y-0 h-full transition-all duration-500 p-5 mx-0 rounded-4xl sm:rounded-full focus-within:bg-white focus-within:dark:bg-secondary focus-within:shadow-xl";

  const inputInnerClass =
    "border-none text-sm shadow-none p-0 focus-visible:ring-0 dark:bg-transparent";

  const form = useForm({
    resolver: zodResolver(searchPropertiesSchema),
    defaultValues: {
      where: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
    },
  });

  const onSubmit = (values: SearchPropertiesSchema) => {
    const params = new URLSearchParams(searchParams);

    for (const key in values) {
      const value = values[key as keyof typeof values];
      if (value) params.set(key, value.toString());
    }

    router.push(`?${params.toString()}`);
  };
  return (
    <Form {...form}>
      <form
        className="flex max-sm:flex-col max-sm:pb-6 gap-2 justify-between items-center sm:h-20 
        bg-white dark:bg-secondary rounded-4xl sm:rounded-full focus-within:bg-sidebar 
        focus-within:dark:bg-sidebar overflow-hidden border border-sidebar-border shadow-xl"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          hideMessage
          inputClassName={inputInnerClass}
          className={inputBaseClass}
          label="Where"
          name="where"
          placeholder="Search places"
        />
        <FormInput
          hideMessage
          inputClassName={inputInnerClass}
          className={inputBaseClass}
          label="Check In"
          name="checkIn"
          placeholder="Choose date"
        />
        <FormInput
          hideMessage
          inputClassName={inputInnerClass}
          className={inputBaseClass}
          label="Check Out"
          name="checkOut"
          placeholder="Choose date"
        />
        <FormInput
          hideMessage
          inputClassName={inputInnerClass}
          className={inputBaseClass}
          label="Guests"
          name="guests"
          placeholder="Add guests"
        />
        <Button type="submit" className="rounded-full h-12 w-12 mr-5">
          <Search />
        </Button>
      </form>
    </Form>
  );
};

export default SearchProperties;
