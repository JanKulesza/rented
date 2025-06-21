import { z } from "zod";
import mongoose from "mongoose";

export enum PropertyTypes {
  APARTAMENT = "Apartment",
  STUDIO = "Studio",
  HOUSE = "House",
  VILLA = "Villa",
  CONDO = "Condo",
  TOWNHOUSE = "Townhouse",
  COMMERCIAL = "Commercial",
  INDUSTRIAL = "Industrial",
  WAREHOUSE = "Warehouse",
}

export enum ListingTypes {
  SALE = "Sale",
  RENT = "Rent",
  PENDING = "Pending",
}

export enum Amenity {
  // Building & Common Areas
  Elevator = "elevator",
  Concierge = "concierge",
  SecuritySystem = "security_system",
  Intercom = "intercom",
  Gym = "gym",
  Spa = "spa",
  Sauna = "sauna",
  SwimmingPool = "swimming_pool",
  CommunityHall = "community_hall",
  BarbecueArea = "barbecue_area",
  Playground = "playground",
  BicycleStorage = "bicycle_storage",

  // Parking
  Garage = "garage",
  CoveredParking = "covered_parking",
  ParkingSpace = "parking_space",
  EVCharging = "ev_charging",

  // Outdoor
  Balcony = "balcony",
  Terrace = "terrace",
  Garden = "garden",
  Yard = "yard",
  RoofTerrace = "roof_terrace",

  // Comfort
  AirConditioning = "air_conditioning",
  CentralHeating = "central_heating",
  UnderfloorHeating = "underfloor_heating",
  Fireplace = "fireplace",
  CeilingFans = "ceiling_fans",
  DoubleGlazing = "double_glazing",

  // Appliances
  Dishwasher = "dishwasher",
  WashingMachine = "washing_machine",
  Dryer = "dryer",
  Oven = "oven",
  Microwave = "microwave",
  Refrigerator = "refrigerator",

  // Technology & Connectivity
  HighSpeedInternet = "high_speed_internet",
  FiberOptic = "fiber_optic",
  SmartHomeSystem = "smart_home_system",
  CableTV = "cable_tv",

  // Storage
  StorageRoom = "storage_room",
  Basement = "basement",
  Attic = "attic",
  WalkInCloset = "walk_in_closet",

  // Safety & Accessibility
  WheelchairAccess = "wheelchair_access",
  VideoIntercom = "video_intercom",
  Alarm = "alarm",
  SmokeDetectors = "smoke_detectors",

  // Eco & Sustainability
  SolarPanels = "solar_panels",
  GreenBuilding = "green_building",
  RainwaterHarvesting = "rainwater_harvesting",

  // Other
  Furnished = "furnished",
  PetFriendly = "pet_friendly",
  Soundproofing = "soundproofing",
  HighCeilings = "high_ceilings",
  HardwoodFloors = "hardwood_floors",
  AccessibleLocation = "accessible_location",
}

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const nonEmptyStr = (val: unknown) =>
  typeof val === "string" && val.trim() !== ""
    ? !["undefined", "null"].includes(val)
      ? Number(val)
      : null
    : null;

export const addressSchema = z.object({
  city: z
    .string({ required_error: "City is required." })
    .min(1, "Provide correct city."),
  state: z
    .string({ required_error: "State is required." })
    .min(2, "Provide correct state."),
  country: z
    .string({ required_error: "Country is required." })
    .min(4, "Provide correct country."),
  zip: z
    .string({ required_error: "Zip code is required." })
    .min(3, "Provide correct zip code.")
    .max(10, "Zip code is too long."),
  address: z
    .string({ required_error: "Address is required." })
    .min(5, "Provide correct address."),
  suite: z.string().optional(),
  lat: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Latitude is required." })
      .min(-90, "Please provide correct latitude.")
      .max(90, "Please provide correct latitude.")
  ),
  lon: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Longitude is required." })
      .min(-180, "Please provide correct longitude.")
      .max(180, "Please provide correct longitude.")
  ),
});

const livingAreaSchema = z.object({
  beds: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Number of beds is required." })
      .min(1, "Please provide correct number of beds.")
  ),
  bedrooms: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Number of bedrooms is required." })
      .min(1, "Please provide correct number of bedrooms.")
  ),
  bathrooms: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Number of bathrooms is required." })
      .min(1, "Please provide correct number of bathrooms.")
  ),
  kitchens: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Number of kitchens is required." })
      .min(1, "Please provide correct number of kitchens.")
  ),
});

export const propertySchema = z.object({
  image: z
    .any({ required_error: "File is required." })
    .optional()
    .refine(
      (file) => (file ? ACCEPTED_IMAGE_TYPES.includes(file.mimetype) : true),
      {
        message: "Invalid image file type",
      }
    ),
  name: z
    .string({ required_error: "Name is required." })
    .min(4, "Name too short.")
    .max(32, "Name too long."),
  description: z
    .string({ required_error: "Description is required." })
    .min(5, "Description too short.")
    .max(500, "Description too long."),
  price: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Price is required." })
      .min(0, "Provide correct price.")
  ),
  rating: z
    .preprocess(
      nonEmptyStr,
      z
        .number({ required_error: "Rating is required." })
        .min(0, "Provide correct rating.")
        .max(100, "Provide correct rating.")
    )
    .optional(),
  listingType: z.nativeEnum(ListingTypes, {
    required_error: "Listing type is required.",
  }),
  propertyType: z.nativeEnum(PropertyTypes, {
    required_error: "Property type is required.",
  }),
  isSold: z.boolean().optional().default(false),
  squareFootage: z.preprocess(
    nonEmptyStr,
    z
      .number({ required_error: "Square footage is required." })
      .min(1, "Please provide correct square footage.")
  ),
  address: addressSchema,
  livingArea: z.preprocess(
    (val) => (val === "null" ? null : val),
    livingAreaSchema.nullable()
  ),
  amenities: z.preprocess(
    (val) =>
      typeof val === "string" && val.trim() !== ""
        ? !["undefined", "null"].includes(val)
          ? val === "[]"
            ? []
            : val.split(",")
          : null
        : null,
    z.array(z.nativeEnum(Amenity))
  ),
  agency: z
    .string({ required_error: "Agency is required." })
    .refine((arg) => mongoose.isValidObjectId(arg), "Invalid agency id."),
  agent: z.preprocess((val) => {
    if (!val) return null;
    if (val === "undefined" || val === "null") return null;
    if (typeof val === "string" && val.trim() === "") return null;

    return val;
  }, z.union([z.literal(null), z.string().refine((arg) => mongoose.isValidObjectId(arg), "Invalid agent id.")])),
});

export type AddressType = z.infer<typeof addressSchema>;
export type PropertySchemaType = z.infer<typeof propertySchema>;
