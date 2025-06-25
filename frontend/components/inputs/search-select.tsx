"use client";
import { ReactNode, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SearchSelectProps {
  name: string;
  label: string;
  children: ReactNode;
  placeholder: string;
}

const SearchSelect = (props: SearchSelectProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get(props.name) ?? "";
  console.log(defaultValue);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (value: string) => {
    router.push(pathname + "?" + createQueryString(props.name, value));
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={handleSearch}>
      <SelectTrigger className="w-full">
        <SelectValue
          defaultValue={defaultValue}
          placeholder={props.placeholder}
        />
      </SelectTrigger>
      <SelectContent>{props.children}</SelectContent>
    </Select>
  );
};

export default SearchSelect;
