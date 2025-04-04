import mongoose from "mongoose";

const propertyTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
});

const PropertyType = mongoose.model("Property Type", propertyTypeSchema);

export default PropertyType;
