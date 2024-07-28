import { validationResult } from "express-validator";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { errorMessages } from "../constants/errorMessages.js";
import { successMessages } from "../constants/successMessages.js";
import { Url } from "../models/url.model.js";
import { generateShorterID } from "../utils/Utils.js";

export const createUrlShortner = asyncHandler(async (req, res) => {
  try {
    const validateResult = validationResult(req).array();

    if (validateResult.length > 0) {
      return res
        .status(422)
        .json(new ApiError(422, validateResult || errorMessages.invalidInput));
    }

    const { originalUrl } = req.body;

    if (!originalUrl || originalUrl === "") {
      return res
        .status(400)
        .json(new ApiError(400, validateResult || errorMessages.missingField));
    }

    const existedURL = await Url.findOne({
      redirectURL: originalUrl,
    });

    if (existedURL) {
      return res.render("homepage", {
        data: existedURL,
      });

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            existedURL.shortId,
            "Original URL is already existed. use provided shortId to redirect to Original Website."
          )
        );
    }

    const shortId = await generateShorterID();

    if (!shortId) {
      return res
        .status(417)
        .json(new ApiError(417, errorMessages.failedToGenerateShortId));
    }

    const URL_RESPONSE = await Url.create({
      shortId: shortId,
      redirectURL: originalUrl,
    });

    if (!URL_RESPONSE) {
      return res
        .status(500)
        .json(new ApiError(500, errorMessages.internalServerError));
    }

    return res.render("homepage", {
      data: URL_RESPONSE,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, URL_RESPONSE, successMessages.newShortUrlCreated)
      );
  } catch (error) {
    console.log("error :>>", error);
    return res.status(417).json(new ApiError(417, error));
  }
});

export const getOriginalURL = asyncHandler(async (req, res) => {
  try {
    const validateResult = validationResult(req).array();

    if (validateResult.length > 0) {
      return res
        .status(422)
        .json(new ApiError(422, validateResult || errorMessages.invalidInput));
    }

    const { shortID } = req.params;

    if (!shortID) {
      return res
        .status(400)
        .json(
          new ApiError(400, validateResult || errorMessages.missingParameter)
        );
    }

    const URL_RESPONSE = await Url.findOneAndUpdate(
      { shortId: shortID },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!URL_RESPONSE) {
      return res
        .status(500)
        .json(new ApiError(500, errorMessages.shortIdDoesNotExist));
    }

    return res.redirect(URL_RESPONSE.redirectURL);
  } catch (error) {
    console.log("error :>>", error);
    return res.status(417).json(new ApiError(417, error));
  }
});

export const retrieveAllData = asyncHandler(async (req, res) => {
  try {
    const URL_RESPONSE = await Url.find({}).select("");

    if (!URL_RESPONSE) {
      return res
        .status(500)
        .json(new ApiError(500, errorMessages.internalServerError));
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, URL_RESPONSE, successMessages.recordsRetrieved)
      );
  } catch (error) {
    console.log("error :>>", error);
    return res.status(417).json(new ApiError(417, error));
  }
});

export const getAllData = asyncHandler(async (req, res) => {
  const URL_RESPONSE = await Url.find({}).select("");

  return res.render("homepage", {
    urls: URL_RESPONSE,
  });
});
