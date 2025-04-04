import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firsName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agency: { type: mongoose.Types.ObjectId, ref: "Agency", required: true },
  sold: { type: Number, min: 0, default: 0 },
});

const User = mongoose.model("User", userSchema);

export default User;
