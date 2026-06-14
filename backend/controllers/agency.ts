import { type NextFunction, type Request, type Response } from "express";
import Agency from "../models/agency.ts";
import mongoose from "mongoose";
import {
  agencySchema,
  type AgencySchemaType,
} from "../schemas/agency.ts";
import { userSchema } from "../schemas/user.ts";
import User from "../models/user.ts";
import Property from "../models/property.ts";
import jwt from "jsonwebtoken";
import { deleteImage, uploadImage } from "../utils/cloudinary.ts";
import formatErrRes from "../utils/format-err-res.ts";
import { UserRoles } from "../types/user.ts";

// Return all agencies without populating the owner, properties, and agents fields. This is to avoid sending too much data to the client.
export const getAgencies = async (req: Request, res: Response, next: NextFunction) => {
  const agencies = await Agency.find()

  res.json(agencies);
};

//Return agency by id with all data
export const getAgency = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json(formatErrRes("Invalid obejct id."));
    return;
  }
  const agency = await Agency.findById(id).populate([
    "owner",
    "properties",
    "agents",
  ]);

  if (!agency) {
    res.status(404).json(formatErrRes("Agency not found."))
    return;
  }

  res.json(agency);
};

// Create agency, for simplification the relation between agencies and owner is 1-1, meaning 1 user can have only 1 agency.
// This might be changed later
export const createAgency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    success: userSuccess,
    data: userData,
    error: userError,
  } = await userSchema.safeParseAsync(req.body);

  if (!userSuccess) {
    res.status(400).json(formatErrRes("Validation failed.", userError));
    return;
  }

  if (await User.findOne({ email: userData.email })) {
    res.status(409).json(formatErrRes("User already exists."));
    return;
  }

  const owner = new User({
    ...userData,
    role: "owner",
  });
  
  const {
    success: agencySuccess,
    data: agencyData,
    error: agencyError,
  } = await agencySchema.safeParseAsync({
    ...req.body,
    owner: owner._id.toString(),
  });

  if (!agencySuccess) {
    res.status(400).json(formatErrRes("Validation failed.", agencyError));
    return;
  }

  if (await Agency.findOne({ name: agencyData.name })) {
    res.status(409).json({ error: "Agency with this name already exists." });
    return;
  }
  const agency = new Agency({
    ...agencyData,
    agents: [owner._id],
  });
  owner.agency = agency._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await owner.save({ session });
    const savedAgency = await agency.save({ session })

    await session.commitTransaction();
    res.status(201).json(await savedAgency.populate("owner"));
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Update agency
export const updateAgency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json(formatErrRes("Invalid object id."));
    return;
  }
  const agency = await Agency.findById(id);

  if (!agency) {
    res.status(404).json(formatErrRes("Agency not found."));
    return;
  }

  const { success, error, data } = await agencySchema
    .partial()
    .safeParseAsync(req.body);

  if (!success) {
    res.status(400).json(formatErrRes("Validation failed.", error));
    return;
  }
  const { name, address } = data;

  if (await Agency.findOne({ name })) {
    res.status(400).json(formatErrRes("Agency with this name already exists."));
    return;
  }

  const updateData: Partial<AgencySchemaType> = { name, address };

  if (req.file) 
    updateData.image = await uploadImage(req.file.path);

  try {
    const updatedAgency = await Agency.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate(["owner", "properties", "agents"]);

    res.json(updatedAgency);
  } catch (error) {
    if (updateData.image) await deleteImage(updateData.image.id);

    next(error);
  }
};

// Delete agency. Delete properties assosiated with the agency and change agents role to User.
export const deleteAgency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json(formatErrRes("Invalid object id."));
    return;
  }

  const agency = await Agency.findById(id);

  if (!agency) {
    res.status(404).json(formatErrRes("Agency not found."));
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await agency.deleteOne({ session });

    await User.updateMany(
      { agency: agency._id },
      { agency: null, role: UserRoles.User, properties: [] },
      {
        session,
      }
    );
    await Property.deleteMany(
      { agency: agency._id },
      {
        session,
      }
    );

    await session.commitTransaction();
    res.json({});
  } catch (error) {
    session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Generates token for joining agency. Returns {token: string}
export const generateAddUserToken = async (req: Request, res: Response) => {
  const { id } = req.params;

  const agency = await Agency.findById(id);
  if (!agency) {
    res.status(404).json(formatErrRes("Agency not found."));
    return;
  }

  const token = jwt.sign({ agencyId: id }, process.env.JWT_SECRET!, {
    expiresIn: 60 * 15,
  });

  res.json({ token });
};

// Join agency, requires valid jwt.
export const joinAgency = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token, userId } = req.body;
  if (!token || typeof token !== "string") {
    res.status(400).json(formatErrRes("Token is required."));
    return;
  }
  
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      agencyId: string;
    } & jwt.JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json(formatErrRes("Invitation expired."));
      return;
    } 
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json(formatErrRes("Invalid token."));
      return;
    }
    return next(error);
  }
  
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json(formatErrRes("User not found."));
    return;
  }
  
  const agency = await Agency.findById(payload.agencyId);

  if (!agency) {
    res.status(400).json(formatErrRes("Invalid agency id."));
    return;
  }

  if (user.agency?.toString() === agency._id.toString()) {
    res
      .status(400)
      .json(formatErrRes(`User is already an agent of ${agency.name}`));
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await agency.updateOne({ $push: { agents: user._id } }, { session });
    await user.updateOne(
      { agency: agency._id, role: UserRoles.Agent },
      { session }
    );
    await session.commitTransaction();
    res.status(200).json({});
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }
};
