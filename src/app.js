import path, { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";

const app = express();

/*==============
==Middlewares==
==============*/

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    allowedHeaders: "",
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("combined"));

app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: false,
    limit: "16kb",
  })
);

import staticRouter from "./routes/static.route.js";
app.use("/", staticRouter);

/*==============
=====Routes=====
==============*/

import urlRouter from "./routes/url.route.js";

app.use(`/api/${process.env.URL_SHORTNER_API_VERSION}/route`, urlRouter);

//  Handle invalid request
app.use(notFoundMiddleware);

export default app;
