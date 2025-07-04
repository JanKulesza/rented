import mongoose from "mongoose";

const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
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

const Agency = mongoose.model("Agency", agencySchema);

export default Agency;
