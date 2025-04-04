import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  isRented: { type: Boolean, required: true },
  rating: { type: Number, required: true, min: 0, max: 100 },
  location: { type: String, required: true },
  agency: { type: mongoose.Types.ObjectId, ref: "Agency", required: true },
});

const Property = mongoose.model("Property", propertySchema);

export default Property;
