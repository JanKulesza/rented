"use client";
import AddProperty from "@/components/app/listings/add-property";
import PropertyCard from "@/components/app/listings/property-card";
import {
  agencyContext,
  Property,
  PropertyTypes,
} from "@/components/providers/agency-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { sort } from "fast-sort";
import { capitalize, formatAddress } from "@/lib/utils";

type FilterState = {
  type: PropertyTypes | null;
  location: string | null;
  sortField: "price" | "createdAt";
  sortOrder: "asc" | "desc";
};

const ListingsPage = () => {
  const {
    agency: { properties },
  } = useContext(agencyContext);
  const [filteredProperties, setFilteredProperties] = useState(
    properties as Property[]
  );
  const DEFAULT_SORT = {
    sortField: "createdAt",
    sortOrder: "desc",
  } as FilterState;
  // Initialize filter state with default values
  const [filter, setFilter] = useState<FilterState>(DEFAULT_SORT);
  const locationInput = useRef<HTMLInputElement>(null);

  const handleFilterByType = (value: PropertyTypes | "All") =>
    setFilter({ ...filter, type: value === "All" ? null : value });

  const handleSearchLocation = () =>
    setFilter({
      ...filter,
      location: locationInput.current?.value ?? null,
    });

  const handleSort = (value: string) => {
    const [field, order] = value.split(" ") as [
      FilterState["sortField"],
      FilterState["sortOrder"]
    ];
    setFilter({ ...filter, sortField: field, sortOrder: order });
  };

  const handleFilterProps = (properties: Property[]) => {
    const filtered = properties
      .filter((p) => (filter.type ? p.propertyType === filter.type : true))
      .filter((p) =>
        filter.location
          ? formatAddress(p.address)
              .toLowerCase()
              .includes(filter.location.toLowerCase())
          : true
      );

    const sorted = sort(filtered)[filter.sortOrder]((p) => p[filter.sortField]);

    setFilteredProperties(sorted);
  };

  useEffect(() => handleFilterProps(properties as Property[]), [filter]);

  return (
    <div className="space-y-5">
      <div className="flex max-lg:flex-col gap-2 justify-between">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:w-2/3">
          <div className="flex shadow-xs rounded-md h-9 overflow-hidden border-input border">
            <Input
              placeholder="Location"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchLocation();
              }}
              ref={locationInput}
              className="shadow-none rounded-none border-none focus-visible:ring-0"
            />
            <Button
              onClick={handleSearchLocation}
              size="icon"
              variant="ghost"
              className="text-muted-foreground h-full border-l border-l-input shadow-none rounded-l-none overflow-hidden rounded-r"
            >
              <Search />
            </Button>
          </div>
          <Select onValueChange={handleFilterByType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {["All", ...Object.values(PropertyTypes)].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleSort}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort By">
                {filter.sortOrder === "asc" ? <ArrowUp /> : <ArrowDown />}{" "}
                {filter.sortField
                  ? capitalize(filter.sortField.split(/(?=[A-Z])/).join(" "))
                  : ""}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[
                { name: "Price", value: "price" },
                { name: "Created At", value: "createdAt" },
              ].map((e) => (
                <SelectItem
                  key={e.value}
                  value={`${e.value} ${
                    filter.sortField === e.value && filter.sortOrder === "asc"
                      ? "desc"
                      : "asc"
                  }`}
                >
                  {filter.sortField === e.value &&
                  filter.sortOrder === "asc" ? (
                    <ArrowDown />
                  ) : (
                    <ArrowUp />
                  )}
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AddProperty
          properties={filteredProperties}
          setProperties={(properties: Property[]) =>
            handleFilterProps(properties)
          }
        />
      </div>
      {filteredProperties.length > 0 ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredProperties.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-10 text-muted-foreground">
          <span>There are no properties to show.</span>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
