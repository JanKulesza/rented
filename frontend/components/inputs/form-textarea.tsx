import { ReactNode } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  name: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

const FormTextArea = (props: FormTextareaProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={props.className}>
          <FormLabel>
            {props.label} {props.icon}
          </FormLabel>
          <FormControl>
            <Textarea {...props} {...field} />
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

export default FormTextArea;
