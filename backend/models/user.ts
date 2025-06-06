import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { deleteImage } from "../utils/cloudinary.ts";
import { UserRoles } from "../utils/schemas/user.ts";

export enum OAuthProviders {
  GOOGLE = "google",
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    image: {
      type: {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
      default: {
        id: "user-placeholder_bz04tm",
        url: "https://res.cloudinary.com/duydunnlr/image/upload/v1749207225/user-placeholder_bz04tm.jpg",
      },
      _id: false,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, min: 6, max: 32 },
    oauthProvider: { type: String, enum: OAuthProviders },
    oauthId: { type: String, index: true },
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
    role: { type: String, enum: UserRoles, default: "user" },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.comparePasswords = async function (password: string) {
  const user = this.toObject();

  return bcrypt.compare(password, user.password);
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

export interface UserDoc extends mongoose.InferSchemaType<typeof userSchema> {
  comparePasswords: (password: string) => Promise<boolean>;
}

const User = mongoose.model<UserDoc>("User", userSchema);

export default User;
