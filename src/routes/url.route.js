import express from "express";
import { body, param } from "express-validator";
import {
  createUrlShortner,
  getOriginalURL,
  retrieveAllData,
} from "../controllers/url.controller.js";

const router = express.Router();

router
  .route("/url")
  .post([body("originalUrl").trim().notEmpty()], createUrlShortner);

router
  .route("/url/:shortID")
  .get([param("shortID").trim().exists()], getOriginalURL);

router.route("/urls").get(retrieveAllData);

export default router;
