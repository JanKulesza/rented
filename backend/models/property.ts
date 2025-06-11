import mongoose from "mongoose";
import { ListingTypes, PropertyTypes } from "../utils/schemas/property.ts";
import { deleteImage } from "../utils/cloudinary.ts";

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      type: {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
      required: true,
      _id: false,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    listingType: { type: String, enum: ListingTypes, required: true },
    isSold: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 100 },
    address: {
      type: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true },
        address: { type: String, required: true },
        lat: { type: Number, required: true, min: -90, max: 90 },
        lon: { type: Number, required: true, min: -180, max: 180 },
        suite: String,
      },
      required: true,
      _id: false,
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    propertyType: {
      type: String,
      enum: PropertyTypes,
      required: true,
    },
  },
  { timestamps: true }
);

propertySchema.pre(
  ["findOneAndDelete", "findOneAndUpdate"],
  async function (next) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc && doc.image?.id) {
      await deleteImage(doc.image.id);
    }
    next();
  }
);

const Property = mongoose.model("Property", propertySchema);

export default Property;
