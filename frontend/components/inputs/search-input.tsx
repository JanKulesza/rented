"use client";
import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

interface SearchInputProps extends InputProps {
  name: string;
  label: string;
}

const SearchInput = (props: SearchInputProps) => {
  const ref = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get(props.name) ?? "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = () => {
    router.push(
      pathname + "?" + createQueryString(props.name, ref.current?.value ?? "")
    );
  };

  return (
    <div className="flex shadow-xs rounded-md h-9 overflow-hidden border-input border">
      <label className="hidden" htmlFor={props.name}>
        {props.label}
      </label>
      <Input
        {...props}
        defaultValue={defaultValue}
        placeholder={props.placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        ref={ref}
        className="shadow-none rounded-none border-none focus-visible:ring-0"
      />
      <Button
        onClick={handleSearch}
        size="icon"
        variant="ghost"
        className="text-muted-foreground h-full border-l border-l-input shadow-none rounded-l-none overflow-hidden rounded-r"
      >
        <Search />
      </Button>
    </div>
  );
};

export default SearchInput;
