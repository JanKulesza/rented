import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";

interface IncrementInputProps {
  label: string;
  name: string;
  description?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
}

const IncrementInput = ({
  label,
  name,
  description,
  min = -Infinity,
  max = Infinity,
  defaultValue = 0,
}: IncrementInputProps) => {
  const { control, watch, setValue } = useFormContext();
  const raw = watch(name);
  const value = Number(raw);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const handleIncrement = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setValue(name, clamp(value + 1));
  };

  const handleDecrease = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setValue(name, clamp(value - 1));
  };
  return (
    <FormField
      control={control}
      name={name}
      rules={{
        min: { value: min, message: `Minimum is ${min}` },
        max: { value: max, message: `Maximum is ${max}` },
      }}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between w-full min-h-10 px-1 py-6 border-b">
          <div className="flex flex-col gap-1">
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={value <= min}
                onClick={handleDecrease}
              >
                <Minus />
              </Button>
              <Input
                type="number"
                className="border-0 shadow-none focus-visible:ring-0 
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={min}
                max={max}
                value={field.value}
                style={{ width: `${(value.toString() ?? "1").length + 3}ch` }} // 3 ch is width of padding
                onChange={(e) => {
                  const num = Math.ceil(Number(e.target.value));
                  field.onChange(clamp(num));
                }}
              />
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={value >= max}
                onClick={handleIncrement}
              >
                <Plus />
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default IncrementInput;
