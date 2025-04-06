import { type NextFunction, type Request, type Response } from "express";
import User from "../models/user.ts";
import mongoose from "mongoose";
import { userSchema, type UserSchemaType } from "../utils/schemas/user.ts";
import Property from "../models/property.ts";
import Agency from "../models/agency.ts";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();

  res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }
  const user = await User.findById(id).populate(["agency", "properties"]);

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  const { success, error } = await userSchema.safeParseAsync(req.body);

  if (!success) {
    res.status(400).json(error.formErrors);
    return;
  }

  const { firstName, lastName, email, password } = req.body as UserSchemaType;

  if (await User.findOne({ email })) {
    res.status(400).json({ error: "User already exists." });
    return;
  }

  const user = new User({ firstName, lastName, email, password });
  const savedUser = await user.save();

  res.status(201).json(savedUser);
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }
  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const { success, error } = await userSchema
    .partial()
    .safeParseAsync(req.body);

  if (!success) {
    res.status(400).json(error.formErrors);
    return;
  }

  const { email, firstName, lastName, password, sold, agency, properties } =
    req.body as Partial<UserSchemaType>;

  if (email && (await User.findOne({ email }))) {
    res.status(400).json({ error: "User already exists." });
    return;
  }

  const updateData: Partial<UserSchemaType> = {
    email,
    firstName,
    lastName,
    password,
    sold,
  };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (properties) {
      updateData.properties = properties;

      for (const property in properties) {
        await Property.findByIdAndUpdate(
          property,
          { agent: user._id },
          { session }
        );
      }
    }

    if (agency) {
      updateData.agency = agency;

      await Agency.findByIdAndUpdate(
        agency,
        { $push: { agents: user._id } },
        { session }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
    }).populate("agency");

    await session.commitTransaction();
    res.json(updatedUser);
  } catch (error) {
    session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (user.properties.length > 0) {
      for (const property in user.properties) {
        await Property.findByIdAndUpdate(
          property,
          { agent: null },
          { session }
        );
      }
    }

    if (user.agency) {
      await Agency.findByIdAndUpdate(
        user.agency,
        { $pull: { agents: user._id } },
        { session }
      );
    }

    await user.deleteOne({ session });

    await session.commitTransaction();
    res.json({});
  } catch (error) {
    session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
