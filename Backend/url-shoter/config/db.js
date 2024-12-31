import mongoose from "mongoose";

const connectToMongoDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Connected to Database!");
  } catch (err) {
    console.log(err.message);
  }
};

export default connectToMongoDB;
