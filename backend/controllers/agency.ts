import { type NextFunction, type Request, type Response } from "express";
import Agency from "../models/agency.ts";
import mongoose from "mongoose";
import {
  agencySchema,
  type AgencySchemaType,
} from "../utils/schemas/agency.ts";
import { userSchema, type UserSchemaType } from "../utils/schemas/user.ts";
import User from "../models/user.ts";
import Property from "../models/property.ts";

export const getAgencies = async (req: Request, res: Response) => {
  const agencies = await Agency.find();

  res.json(agencies);
};

export const getAgency = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }
  const agency = await Agency.findById(id).populate([
    "owner",
    "properties",
    "agents",
  ]);

  if (!agency) {
    res.status(404).json({ error: "Agency not found." });
    return;
  }

  res.json(agency);
};

export const createAgency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success: userSuccess, error: userError } =
    await userSchema.safeParseAsync(req.body);

  if (!userSuccess) {
    res.status(400).json(userError.errors);
    return;
  }

  const { firstName, lastName, email, password } = req.body as UserSchemaType;
  if (await User.findOne({ email })) {
    res.status(400).json({ error: "User already exists." });
    return;
  }

  const owner = new User({ firstName, lastName, email, password });

  const { name, location } = req.body as AgencySchemaType;

  const { success: agencySuccess, error: agencyError } =
    await agencySchema.safeParseAsync({
      name,
      location,
      owner: owner._id.toString(),
    });

  if (!agencySuccess) {
    res.status(400).json(agencyError.errors);
    return;
  }

  const agency = new Agency({ name, location, owner: owner._id });
  owner.agency = agency._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await owner.save({ session });
    const savedAgency = await agency.save({ session });

    const populatedAgency = await savedAgency.populate("owner");

    await session.commitTransaction();
    res.status(201).json(populatedAgency);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export const updateAgency = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }
  const agency = await Agency.findById(id);

  if (!agency) {
    res.status(404).json({ error: "Agency not found." });
    return;
  }

  const { success, error } = await agencySchema
    .partial()
    .safeParseAsync(req.body);

  if (!success) {
    res.status(400).json(error.formErrors);
    return;
  }

  const { name, location, owner } = req.body as AgencySchemaType;

  const newOwner = await User.findById(owner);
  if (!newOwner) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  const updatedAgency = await Agency.findByIdAndUpdate(
    id,
    {
      name,
      location,
      owner,
    },
    { new: true }
  ).populate("owner");

  res.json(updatedAgency);
};

export const deleteAgency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }

  const agency = await Agency.findById(id);

  if (!agency) {
    res.status(404).json({ error: "Agency not found." });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await agency.deleteOne({ session });

    await User.find({ agency: agency._id }, { session }).deleteMany({
      session,
    });
    await Property.find({ agency: agency._id }, { session }).deleteMany({
      session,
    });

    await session.commitTransaction();
    res.json({});
  } catch (error) {
    session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
