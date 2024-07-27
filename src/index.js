import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`\nServer is listening on PORT : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`\nmongoDB connection failed !!`, err);
  });
