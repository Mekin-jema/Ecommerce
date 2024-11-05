import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect("mongodb://127.0.0.1:27017/E-commerce");
    console.log(`MongoDB connected:${con.connection.host}`);
  } catch (error) {
    console.log("Error connection to Mongodb", error.message);
    process.exit(1);
  }
};
