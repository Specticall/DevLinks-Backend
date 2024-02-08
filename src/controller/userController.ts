import { RequestHandler } from "express";
import { User } from "../model/userModel";
import { retrieveIdFromJWT } from "../utils/helper";
import { AppError } from "../utils/AppError";

export const getAllUsers: RequestHandler = async (request, response, next) => {
  try {
    const users = await User.find();
    response.status(200).send({
      status: "success",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUser: RequestHandler = async (request, response, next) => {
  try {
    const id = request.params.id;

    // User Id data is only available for the corresponding user.
    const headerToken = request.headers.authorization;
    if (!headerToken) throw new AppError("Header Token does not exist", 401);

    const { id: idFromToken } = retrieveIdFromJWT(headerToken);

    // Only show certain fields if the jwt token and id params do not match.
    const user = await User.findById(id).select(
      idFromToken === id ? "" : "firstName profileURL linkList"
    );

    response.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
