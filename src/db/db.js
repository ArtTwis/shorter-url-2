import mongoose from "mongoose";
import { constants } from "../constants/common.js";

const connectDB = async () => {
  try {
    const mongoDbConnectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${constants.DB_NAME}`
    );

    console.log(
      `Connect to mongodb successfully, DB host :`,
      mongoDbConnectionInstance.connection.host
    );
  } catch (error) {
    console.log(`Error while connecting to db :`, error);
    process.exit(1);
  }
};

export default connectDB;
