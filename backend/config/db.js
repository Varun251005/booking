import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = (process.env.MONGO_URI || "").trim();

  if (!mongoUri) {
    console.log("MONGO_URI is not set. Skipping MongoDB connection.");
    return;
  }

  if (/[<>]/.test(mongoUri)) {
    console.log("MONGO_URI still contains placeholder brackets. Replace <...> with your real MongoDB password and remove the brackets.");
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
  }
};

export default connectDB;