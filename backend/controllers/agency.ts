import { type NextFunction, type Request, type Response } from "express";
import Agency from "../models/agency.ts";
import mongoose from "mongoose";
import {
  agencySchema,
  type AgencySchemaType,
} from "../utils/schemas/agency.ts";
import {
  UserRoles,
  userSchema,
  type UserSchemaType,
} from "../utils/schemas/user.ts";
import User from "../models/user.ts";
import Property from "../models/property.ts";
import jwt from "jsonwebtoken";

export const getAgencies = async (req: Request, res: Response) => {
  const { populate } = req.query;
  enum PopulateEnum {
    "owner",
    "agents",
    "properties",
  }

  if (!populate) {
    const agencies = await Agency.find();
    res.json(agencies);
    return;
  }

  if (!Array.isArray(populate)) {
    res.status(400).json({ error: "Invalid populate query type." });
    return;
  }
  let isValid = true;
  for (const val of populate)
    if (!Object.values(PopulateEnum).includes(val.toString())) isValid = false;

  const agencies = await Agency.find().populate(
    isValid && populate ? populate.map((p) => p.toString()) : []
  );

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

  const owner = new User({
    firstName,
    lastName,
    email,
    password,
    role: "owner",
  });

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

  const agency = new Agency({
    name,
    location,
    owner: owner._id,
    agents: [owner._id],
  });
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

  const { name, location } = req.body as AgencySchemaType;

  const updatedAgency = await Agency.findByIdAndUpdate(
    id,
    {
      name,
      location,
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

export const generateAddUserToken = async (req: Request, res: Response) => {
  const { id } = req.params;

  const agency = await Agency.findById(id);
  if (!agency) {
    res.status(404).json({ error: "Agency not found." });
  }

  const token = jwt.sign({ agencyId: id }, process.env.JWT_SECRET!, {
    expiresIn: 60 * 15,
  });

  res.json({ token });
};

export const joinAgency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, userId } = req.body;
  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Token is required." });
    return;
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      agencyId: string;
    } & jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Invitation expired." });
      return;
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: "Invalid token." });
      return;
    }
    return next(error);
  }

  const agency = await Agency.findById(payload.agencyId);

  if (!agency) {
    res.status(400).json({ error: "Invalid agency id." });
    return;
  }

  if (user.agency?.toString() === agency._id.toString()) {
    res
      .status(400)
      .json({ error: `User is already an agent of ${agency.name}` });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await agency.updateOne({ $push: { agents: user._id } }, { session });
    await user.updateOne(
      { agency: agency._id, role: UserRoles.AGENT },
      { session }
    );
    await session.commitTransaction();
    res.status(200).json({});
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }
};
