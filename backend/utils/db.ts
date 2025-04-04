import mongoose from "mongoose";

const connectDB = async (url: string) => {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(url);
    console.log("Conected to MongoDB...");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
