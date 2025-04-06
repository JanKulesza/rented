import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  agents: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  properties: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Property",
    default: [],
  },
});

const Agency = mongoose.model("Agency", agencySchema);

export default Agency;
