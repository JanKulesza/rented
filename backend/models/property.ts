import mongoose from "mongoose";
import { PropertyTypes } from "../utils/schemas/property.ts";
import { deleteImage } from "../utils/cloudinary.ts";

const propertySchema = new mongoose.Schema({
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
    required: true,
  },
});

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
