import express from "express";
import cors from "cors";
import { BASE_ENDPOINT } from "./utils/config";
import userRouter from "./routes/userRoute";
import linkRouter from "./routes/linkRoute";

import { handleError } from "./controller/errorController";
import { AppError } from "./utils/AppError";
const app = express();

// Enable fetching from localhost
app.use(cors());

// Middle to parse body request
app.use(express.json());

app.use(`${BASE_ENDPOINT}/v1/users`, userRouter);
app.use(`${BASE_ENDPOINT}/v1/links`, linkRouter);

// Handle invalid route
app.use("*", (request, response, next) => {
  console.log("here");
  next(new AppError("The route you requested does not exist", 404));
});

// Handle Errors
app.use(handleError);

export default app;
