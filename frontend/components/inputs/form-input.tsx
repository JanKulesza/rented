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
import { Textarea } from "../ui/textarea";

interface FormInputProps extends InputProps {
  name: string;
  label: string;
  variant?: "textarea" | "input";
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
            {!props.variant || props.variant === "input" ? (
              <Input {...props} {...field} />
            ) : (
              <Textarea placeholder={props.placeholder} {...field} />
            )}
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
