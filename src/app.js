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

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(helmet());

app.use(morgan("combined"));

app.use(express.static("public"));

/*==============
=====Routes=====
==============*/

//  Handle invalid request
app.use(notFoundMiddleware);

export default app;
