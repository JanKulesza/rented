import { type NextFunction, type Request, type Response } from "express";
import Property from "../models/property.ts";
import mongoose from "mongoose";
import {
  propertySchema,
  type PropertySchemaType,
} from "../utils/schemas/property.ts";
import Agency from "../models/agency.ts";
import User from "../models/user.ts";
import { deleteImage, uploadImage } from "../utils/cloudinary.ts";

export const getProperties = async (req: Request, res: Response) => {
  const properties = await Property.find();

  res.json(properties);
};

export const getProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }
  const property = await Property.findById(id).populate(["agent", "agency"]);

  if (!property) {
    res.status(404).json({ error: "Property not found." });
    return;
  }

  res.json(property);
};

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success, error } = await propertySchema.safeParseAsync({
    ...req.body,
    price: 10,
    rating: 10,
    image: req.file,
  });

  if (!success) {
    res.status(400).json(error.formErrors);
    return;
  }
  const {
    agency,
    description,
    agent,
    location,
    name,
    price,
    propertyType,
    rating,
  } = req.body as PropertySchemaType;

  const assignedAgency = await Agency.findById(agency);
  const assignedAgent = await User.findById(agent);
  if (!assignedAgency!.agents.includes(new mongoose.Types.ObjectId(agent))) {
    res.status(400).json({ error: "Agent does not belong to this agency." });
    return;
  }

  const { id, url } = await uploadImage(req.file!.path);

  const property = new Property({
    agency,
    description,
    agent,
    location,
    name,
    price,
    propertyType,
    rating,
    image: { id, url },
  });

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const savedProperty = await property.save({ session });

    await assignedAgency!.updateOne(
      { $push: { properties: savedProperty._id } },
      { session }
    );

    await assignedAgent!.updateOne(
      { $push: { properties: savedProperty._id } },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json(savedProperty);
  } catch (error) {
    await session.abortTransaction();
    await deleteImage(id);
    next(error);
  } finally {
    await session.endSession();
  }
};

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }
  const property = await Property.findById(id);

  if (!property) {
    res.status(404).json({ error: "Property not found." });
    return;
  }

  const { success, error } = await propertySchema
    .partial()
    .superRefine(({ agency }, ctx) => {
      if (agency) {
        ctx.addIssue({
          path: ["agency"],
          code: "custom",
          message: "Assigning different agency is forbidden.",
        });
        return false;
      }
    })
    .safeParseAsync({ ...req.body, image: req.file });

  if (!success) {
    res.status(400).json(error.formErrors);
    return;
  }

  const {
    agency,
    description,
    agent,
    location,
    name,
    price,
    propertyType,
    rating,
  } = req.body as Partial<PropertySchemaType>;

  const updateData: Partial<PropertySchemaType> = {
    description,
    location,
    name,
    price,
    propertyType,
    rating,
  };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    if (agent && agent !== property.agent.toString()) {
      const assignedAgent = await User.findById(agent);
      if (agency !== assignedAgent?.agency || !assignedAgent) {
        res.status(400).json("Agent does not belong to this agency.");
        return;
      }

      if (!assignedAgent.properties.includes(property._id))
        assignedAgent.updateOne(
          { $push: { properties: property._id } },
          { session }
        );

      updateData.agent = agent;
    }

    if (req.file) {
      const imageData = await uploadImage(req.file.path);
      updateData.image = imageData;
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
      session,
    });

    await session.commitTransaction();
    res.json(updatedProperty);
  } catch (error) {
    await session.abortTransaction();
    if (updateData.image) await deleteImage(updateData.image.id);
    next(error);
  } finally {
    await session.endSession();
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid object id." });
    return;
  }

  const property = await Property.findById(id);

  if (!property) {
    res.status(404).json({ error: "Property not found." });
    return;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await property.deleteOne({ session });
    await Agency.findByIdAndUpdate(
      property.agency,
      { $pull: { properties: property._id } },
      { session }
    );

    await User.findByIdAndUpdate(
      property.agent,
      { $pull: { properties: property._id } },
      { session }
    );

    await session.commitTransaction();
    await deleteImage(property.image.id);
    res.json({});
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};
