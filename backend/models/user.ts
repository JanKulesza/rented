import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { deleteImage } from "../utils/cloudinary.ts";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: {
    type: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    default: null,
    _id: false,
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    default: null,
  },
  properties: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Property",
    default: [],
  },
  sold: { type: Number, min: 0, default: 0 },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.pre("save", async function (next) {
  const password = this.get("password");
  if (password) {
    this.set("password", await bcrypt.hash(password, 10));
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as mongoose.UpdateQuery<unknown>;

  if (update.password) {
    update.password = await bcrypt.hash(update.password, 10);
  } else if (update.$set?.password) {
    update.$set.password = await bcrypt.hash(update.$set.password, 10);
  }

  next();
});

userSchema.pre(["findOneAndDelete", "findOneAndUpdate"], async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc && doc.image?.id) {
    await deleteImage(doc.image.id);
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
