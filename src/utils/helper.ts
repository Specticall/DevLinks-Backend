import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_EXPIRE_TIME } from "./config";
import { AppError } from "./AppError";

export async function hashPassword(password: string) {
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT)
  );
  return hashedPassword;
}

export function createJWT(id: mongoose.Types.ObjectId) {
  return jwt.sign({ id }, process.env.JWT_STRING, {
    expiresIn: JWT_EXPIRE_TIME,
  });
}

export function retrieveIdFromJWT(headerToken: string) {
  const token = headerToken.split(" ")[1];
  if (!token) throw new AppError("JWT Not found in the header", 401);

  // jwt.verify automatically throws if an invalid token is supplied
  return jwt.verify(token, process.env.JWT_STRING) as JwtPayload;
}

export function swapByReference<T>(
  ref: T[],
  index1: number,
  index2: number
): void {
  const temp = ref[index1];
  ref[index1] = ref[index2];
  ref[index2] = temp;
}
