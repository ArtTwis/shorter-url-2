import mongoose from "mongoose";
import { errorMessages } from "../constants/errorMessages.js";

const UrlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: [
        true,
        "Error: ShortId is must required! Check and try again...",
      ],
      unique: [true, errorMessages.shortIdAlreadyExist],
      trim: true,
    },
    redirectURL: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Url = mongoose.model("Url", UrlSchema);
