"use client";
import { ReactNode } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input, InputProps } from "../ui/input";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputProps {
  name: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

const FormInput = (props: FormInputProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={cn("mx-1", props.className)}>
          <FormLabel>
            {props.label} {props.icon}
          </FormLabel>
          <FormControl>
            <Input {...props} {...field} className="" />
          </FormControl>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
