import {
  UserCheck,
  Shield,
  Phone,
  Dumbbell,
  Thermometer,
  Droplet,
  Users,
  Activity,
  Bike,
  Car,
  Home,
  Zap,
  Sidebar,
  TreeDeciduous,
  Wind,
  Sun,
  Fan,
  Coffee,
  RotateCcw,
  Microwave,
  Wifi,
  Cpu,
  Smartphone,
  Tv,
  Archive,
  Package,
  Video,
  AlertCircle,
  Bell,
  Leaf,
  CloudRain,
  Heart,
  VolumeX,
  ArrowUpWideNarrow,
  Square,
  MapPin,
  SquareKanban,
  Sparkles,
  ParkingSquare,
  Trees,
  Flower2,
  FlameKindling,
  Heater,
  Grid2X2,
  Refrigerator,
  BrickWall,
  Accessibility,
} from "lucide-react";

// All Amenities enum
// After adding new Amenity make sure to include it in corresponding category in AmenityMapping
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

export const AmenityMappings = {
  building: {
    label: "Building",
    values: [
      {
        value: Amenity.Elevator,
        label: "Elevator",
        icon: SquareKanban,
      },
      {
        value: Amenity.Concierge,
        label: "Concierge",
        icon: UserCheck,
      },
      {
        value: Amenity.SecuritySystem,
        label: "Security System",
        icon: Shield,
      },
      { value: Amenity.Intercom, label: "Intercom", icon: Phone },
      { value: Amenity.Gym, label: "Gym", icon: Dumbbell },
      { value: Amenity.Spa, label: "Spa", icon: Sparkles },
      { value: Amenity.Sauna, label: "Sauna", icon: Thermometer },
      {
        value: Amenity.SwimmingPool,
        label: "Swimming Pool",
        icon: Droplet,
      },
      {
        value: Amenity.CommunityHall,
        label: "Community Hall",
        icon: Users,
      },
      {
        value: Amenity.BarbecueArea,
        label: "BBQ Area",
        icon: Heater,
      },
      {
        value: Amenity.Playground,
        label: "Playground",
        icon: Activity,
      },
      {
        value: Amenity.BicycleStorage,
        label: "Bicycle Storage",
        icon: Bike,
      },
    ],
  },

  parking: {
    label: "Parking",
    values: [
      { value: Amenity.Garage, label: "Garage", icon: Car },
      {
        value: Amenity.CoveredParking,
        label: "Covered Parking",
        icon: Home,
      },
      {
        value: Amenity.ParkingSpace,
        label: "Parking Space",
        icon: ParkingSquare,
      },
      { value: Amenity.EVCharging, label: "EV Charging", icon: Zap },
    ],
  },

  outdoor: {
    label: "Outdoor",
    values: [
      { value: Amenity.Balcony, label: "Balcony", icon: Sidebar },
      { value: Amenity.Terrace, label: "Terrace", icon: Home },
      { value: Amenity.Garden, label: "Garden", icon: Trees },
      { value: Amenity.Yard, label: "Yard", icon: TreeDeciduous },
      {
        value: Amenity.RoofTerrace,
        label: "Roof Terrace",
        icon: Flower2,
      },
    ],
  },

  comfort: {
    label: "Comfort",
    values: [
      {
        value: Amenity.AirConditioning,
        label: "Air Conditioning",
        icon: Wind,
      },
      {
        value: Amenity.CentralHeating,
        label: "Central Heating",
        icon: Thermometer,
      },
      {
        value: Amenity.UnderfloorHeating,
        label: "Underfloor Heating",
        icon: Sun,
      },
      {
        value: Amenity.Fireplace,
        label: "Fireplace",
        icon: FlameKindling,
      },
      { value: Amenity.CeilingFans, label: "Ceiling Fans", icon: Fan },
      {
        value: Amenity.DoubleGlazing,
        label: "Double Glazing",
        icon: Grid2X2,
      },
    ],
  },

  appliances: {
    label: "Appliances",
    values: [
      {
        value: Amenity.Dishwasher,
        label: "Dishwasher",
        icon: Coffee,
      },
      {
        value: Amenity.WashingMachine,
        label: "Washing Machine",
        icon: RotateCcw,
      },
      { value: Amenity.Dryer, label: "Dryer", icon: Wind },
      { value: Amenity.Oven, label: "Oven", icon: Microwave },
      {
        value: Amenity.Microwave,
        label: "Microwave",
        icon: Microwave,
      },
      {
        value: Amenity.Refrigerator,
        label: "Refrigerator",
        icon: Refrigerator,
      },
    ],
  },

  tech: {
    label: "Tech",
    values: [
      {
        value: Amenity.HighSpeedInternet,
        label: "High Speed Internet",
        icon: Wifi,
      },
      { value: Amenity.FiberOptic, label: "Fiber Optic", icon: Cpu },
      {
        value: Amenity.SmartHomeSystem,
        label: "Smart Home System",
        icon: Smartphone,
      },
      { value: Amenity.CableTV, label: "Cable TV", icon: Tv },
    ],
  },

  storage: {
    label: "Storage",
    values: [
      {
        value: Amenity.StorageRoom,
        label: "Storage Room",
        icon: Archive,
      },
      { value: Amenity.Basement, label: "Basement", icon: BrickWall },
      { value: Amenity.Attic, label: "Attic", icon: Home },
      {
        value: Amenity.WalkInCloset,
        label: "Walk-in Closet",
        icon: Package,
      },
    ],
  },

  safety: {
    label: "Safety",
    values: [
      {
        value: Amenity.WheelchairAccess,
        label: "Wheelchair Access",
        icon: Accessibility,
      },
      {
        value: Amenity.VideoIntercom,
        label: "Video Intercom",
        icon: Video,
      },
      { value: Amenity.Alarm, label: "Alarm", icon: AlertCircle },
      {
        value: Amenity.SmokeDetectors,
        label: "Smoke Detectors",
        icon: Bell,
      },
    ],
  },

  eco: {
    label: "Eco",
    values: [
      { value: Amenity.SolarPanels, label: "Solar Panels", icon: Sun },
      {
        value: Amenity.GreenBuilding,
        label: "Green Building",
        icon: Leaf,
      },
      {
        value: Amenity.RainwaterHarvesting,
        label: "Rainwater Harvesting",
        icon: CloudRain,
      },
    ],
  },

  other: {
    label: "Other",
    values: [
      { value: Amenity.Furnished, label: "Furnished", icon: Home },
      { value: Amenity.PetFriendly, label: "Pet Friendly", icon: Heart },
      {
        value: Amenity.Soundproofing,
        label: "Soundproofing",
        icon: VolumeX,
      },
      {
        value: Amenity.HighCeilings,
        label: "High Ceilings",
        icon: ArrowUpWideNarrow,
      },
      {
        value: Amenity.HardwoodFloors,
        label: "Hardwood Floors",
        icon: Square,
      },
      {
        value: Amenity.AccessibleLocation,
        label: "Accessible Location",
        icon: MapPin,
      },
    ],
  },
};
