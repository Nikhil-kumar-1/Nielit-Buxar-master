import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "NIELIT_BUXAR",
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((err) => {
      console.log(`Some error occure while connecting to database: ${err}`);
    });
};
