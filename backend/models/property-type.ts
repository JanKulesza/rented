import mongoose from "mongoose";

const propertyTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "Apartment",
      "House",
      "Villa",
      "Condo",
      "Townhouse",
      "Land",
      "Commercial",
      "Industrial",
    ],
    immutable: true,
  },
  description: { type: String, required: true },
});

const PropertyType = mongoose.model("Property Type", propertyTypeSchema);

export default PropertyType;
