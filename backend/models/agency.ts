import mongoose from "mongoose";
import { deleteImage } from "../utils/cloudinary.ts";

const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, min: 4, max: 32 },
    image: {
      type: {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
      default: {
        id: "agency_placeholder_ztd99a",
        url: "https://res.cloudinary.com/duydunnlr/image/upload/v1751053567/agency_placeholder_ztd99a.png",
      },
      _id: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: {
        city: { type: String, required: true },
        state: { type: String, required: true, min: 2 },
        country: { type: String, required: true, min: 4 },
        zip: { type: String, required: true, min: 3, max: 10 },
        address: { type: String, required: true },
        lat: { type: Number, required: true, min: -90, max: 90 },
        lon: { type: Number, required: true, min: -180, max: 180 },
        suite: String,
      },
      required: true,
      _id: false,
    },
    agents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    properties: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Property",
      default: [],
    },
  },
  { timestamps: true }
);

agencySchema.pre(
  ["findOneAndDelete", "findOneAndUpdate"],
  async function (next) {
    const doc = await this.model.findOne(this.getQuery());
    if (doc && doc.image?.id) {
      await deleteImage(doc.image.id);
    }
    next();
  }
);

const Agency = mongoose.model("Agency", agencySchema);

export default Agency;
