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
        <FormItem>
          <FormLabel>
            {props.label} {props.icon}
          </FormLabel>
          <FormControl>
            <Input
              type={props.type}
              className={props.className}
              defaultValue={props.defaultValue}
              size={props.size}
              placeholder={props.placeholder}
              {...field}
            />
          </FormControl>
          <FormDescription>{props.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
