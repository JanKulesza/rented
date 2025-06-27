import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { deleteImage } from "../utils/cloudinary.ts";
import { UserRoles } from "../utils/schemas/user.ts";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export enum OAuthProviders {
  GOOGLE = "google",
}

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: false, min: 6, max: 32 },
    oauthProvider: { type: String, enum: OAuthProviders },
    oauthId: { type: String, index: true },
    image: {
      type: {
        id: { type: String, required: true },
        url: { type: String, required: true },
      },
      default: {
        id: "user_placeholder_wdsqjq",
        url: "https://res.cloudinary.com/duydunnlr/image/upload/v1751053567/user_placeholder_wdsqjq.png",
      },
      _id: false,
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
    sold: { type: Number, min: 0, default: 0 },
    role: { type: String, enum: UserRoles, default: "user" },
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

userSchema.methods.generateRefreshToken = function () {
  const { _id, email, role } = this;
  const refreshToken = jwt.sign(
    { _id, email, role },
    process.env.REFRESH_SECRET!,
    {
      expiresIn: 60 * 60 * 24 * 30,
    }
  );

  return serialize("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
};

userSchema.methods.generateAccessToken = function () {
  const { _id, email, role } = this;
  return jwt.sign({ _id, email, role }, process.env.ACCESS_SECRET!, {
    expiresIn: 60 * 15,
  });
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
  generateRefreshToken: () => string;
  generateAccessToken: () => string;
}

const User = mongoose.model<UserDoc>("User", userSchema);

export default User;
