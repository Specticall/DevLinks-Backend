import { ErrorRequestHandler, Response } from "express";
import { AppError } from "../utils/AppError";
import { Error as MongooseError } from "mongoose";

const sendErrorDevelopment = (response: Response, error: AppError | Error) => {
  let packagedError;
  if (error instanceof AppError) {
    const { message, status, statusCode, stack } = error;
    packagedError = {
      status,
      message,
      statusCode,
      stack,
      error,
      type: "Operational Error",
    };
  } else {
    const { message, stack } = error;
    packagedError = {
      stack,
      error,
      statusCode: 500,
      message,
      type: "Programmer Error",
    };
  }

  response.status(packagedError.statusCode).send(packagedError);
};

const sendErrorProduction = (response: Response, error: AppError | Error) => {
  let packagedError;
  if (error instanceof AppError) {
    const { status, statusCode, message } = error;
    packagedError = {
      status,
      statusCode,
      message,
    };
  } else {
    packagedError = {
      status: "fail",
      statusCode: 500,
      message: "Oops! Something went wrong, please try again later",
    };
  }

  response.status(packagedError.statusCode).send(packagedError);
};

export const handleError: ErrorRequestHandler = async (
  error,
  request,
  response,
  next
) => {
  // invalid JWT format
  if (error.name === "JsonWebTokenError") {
    error = new AppError("Invalid JWT", 401);
  }

  // Expired JWT Token
  if (error.name === "TokenExpiredError") {
    error = new AppError("JWT Has expired", 401);
  }

  // Invalid Id Error
  if (error instanceof MongooseError.CastError) {
    const message = `Invalid ${error.path} : ${error.value}`;
    error = new AppError(message, 404);
  }

  // Mongoose Validation Error
  if (error instanceof MongooseError.ValidationError) {
    error = new AppError(error.message, 400);
  }

  // Duplicate id
  if (error.code === 11000) {
    console.log(error);
    const [[errorField, errorValue]] = Object.entries(error.keyValue);
    error = new AppError(`Duplicate value, ${errorField} : ${errorValue}`, 400);
  }

  // Send off error to API user
  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(response, error);
  } else {
    sendErrorProduction(response, error);
  }
};
