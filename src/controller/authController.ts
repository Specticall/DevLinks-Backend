import { RequestHandler } from "express";
import { User } from "../model/userModel";
import { AppError } from "../utils/AppError";
import { compare } from "bcrypt";
import { createJWT } from "../utils/helper";
import jwt, { JwtPayload } from "jsonwebtoken";

export const register: RequestHandler = async (request, response, next) => {
  try {
    //1. Create user from request body
    const { email, password, passwordConfirm, firstName, lastName } =
      request.body;

    //2. Hash (done is pre save function) + Send the password to database
    const newUser = await User.create({
      email,
      password,
      passwordConfirm,
      firstName,
      lastName,
    });

    response.status(200).send({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (request, response, next) => {
  try {
    // 1. Check if the body data exists
    const { password, email } = request.body;
    if (!password || !email)
      throw new AppError("Please provide a password and email", 400);

    // 2. Validate the user password with the database password
    const userWithPassword = await User.findOne({ email }).select("+password");
    if (!userWithPassword) throw new AppError("User does not exist", 404);

    const passwordIsCorrect = await compare(
      password,
      userWithPassword.password
    );
    if (!passwordIsCorrect) throw new AppError("Invalid Password", 400);

    // 4. Send a Response with JWT
    const user = await User.find({ email });

    response.status(200).json({
      status: "success",
      token: createJWT(userWithPassword._id),
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const protect: RequestHandler = async (request, response, next) => {
  try {
    // 1. Retrieve token from the header
    const { authorization: headerToken } = request.headers;
    if (!headerToken || !headerToken.startsWith("Bearer"))
      throw new AppError("Authorization header does not exist", 401);

    // 2. Verify the token
    const token = headerToken.split(" ")[1];
    if (!token) throw new AppError("JWT Not found in the header", 401);

    // jwt.verify automatically throws if an invalid token is supplied
    const tokenIsValid = jwt.verify(
      token,
      process.env.JWT_STRING
    ) as JwtPayload;

    const { id: userId, iat: issuedAtTimeStamp } = tokenIsValid;
    const user = await User.findById(userId);
    // 4. Check if user was deleted
    if (!user || !issuedAtTimeStamp)
      throw new AppError("User no longer exists", 401);

    // 3. Check when the password was last changed
    if (
      user.passwordChangedAt &&
      user.passwordChangedAt.getTime() / 1000 > issuedAtTimeStamp
    )
      throw new AppError("Password has recently been changed", 401);

    next();
  } catch (error) {
    next(error);
  }
};
