import Tile from "@/components/elements/tile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import AddProperty from "../add-property/add-property";
import { Property } from "@/components/providers/agency-provider";
import { listingTypesMapping } from "@/entities/listing-types";
import DeleteProperty from "./delete-property";

interface PropertyInsightsProps {
  property: Property;
  setProperty: (p: Property) => void;
}

const PropertyInsights = ({ property, setProperty }: PropertyInsightsProps) => {
  const listingTypeMap = listingTypesMapping.find(
    (lt) => lt.type === property.listingType
  );
  return (
    <Card className="sticky top-28">
      <CardHeader className="text-lg font-semibold">
        Property Insights
        <CardDescription>See how this listing is performing.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tile
          label={property.listingType}
          info="Listing type"
          icon={listingTypeMap!.icon}
          className="w-full dark:bg-transparent bg-transparent has-[>svg]:px-0 p-0 min-h-10 min-w-10 pointer-events-none border-none shadow-none text-primary"
        />
        <div
          className="grid grid-cols-2 gap-4 text-sm opacity-30"
          aria-disabled={true}
        >
          <div>
            <p className="text-muted-foreground">Total Views</p>
            <p className="text-xl font-bold">248</p>
          </div>
          <div>
            <p className="text-muted-foreground">Leads</p>
            <p className="text-xl font-bold">17</p>
          </div>
          <div>
            <p className="text-muted-foreground">Favorites</p>
            <p className="text-xl font-bold">34</p>
          </div>
          <div>
            <p className="text-muted-foreground">CTR</p>
            <p className="text-xl font-bold">2,78%</p>
          </div>
          Analytics coming soon
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <div className="flex w-full gap-2">
          <AddProperty
            className="flex-1"
            editMode
            property={property}
            setProperty={setProperty}
          />
          <DeleteProperty propertyId={property._id} />
        </div>
        <Button variant="secondary" className="w-full">
          Full Analytics
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyInsights;
