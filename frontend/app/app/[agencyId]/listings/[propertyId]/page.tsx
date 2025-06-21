import PropertyDetails from "@/components/app/listings/details/property-details";
import { Property } from "@/components/providers/agency-provider";
import { notFound, redirect } from "next/navigation";

const PropertDetailsPage = async ({
  params,
}: {
  params: Promise<{ propertyId: string; agencyId: string }>;
}) => {
  const { propertyId, agencyId } = await params;

  const res = await fetch(`http://localhost:8080/api/properties/${propertyId}`);

  if (!res.ok) {
    if (res.status === 500)
      return redirect(`/app/${agencyId}/listings?redirectStatus=500`);
    else return notFound();
  }

  const property = (await res.json()) as Property;

  return <PropertyDetails p={property} />;
};

export default PropertDetailsPage;
