import mongoose from "mongoose";
import { PropertyTypes } from "../utils/schemas/property.ts";

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isRented: { type: Boolean, default: false },
  rating: { type: Number, required: true, min: 0, max: 100 },
  location: { type: String, required: true },
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  propertyType: {
    type: String,
    enum: PropertyTypes,
    ref: "Property Type",
    required: true,
  },
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
