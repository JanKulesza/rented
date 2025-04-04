import mongoose from "mongoose";

const agencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  agents: { type: [mongoose.Types.ObjectId], ref: "User", required: true },
  location: { type: String, required: true },
  properties: {
    type: [mongoose.Types.ObjectId],
    ref: "Property",
    required: true,
  },
});

const Agency = mongoose.model("Agency", agencySchema);

export default Agency;
