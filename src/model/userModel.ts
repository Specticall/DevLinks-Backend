import { Schema, model } from "mongoose";
import { isEmail } from "validator";
import { linkSchema } from "./linkModel";
import { hashPassword } from "../utils/helper";
import ShortUniqueId from "short-unique-id";

type TUser = {
  email: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt?: Date;
  profilePicture?: string;
  firstName: string;
  lastName?: string;
  linkList: string[];
  profileURL: string;
  shortURL: string;
};

const userSchema = new Schema<TUser>({
  email: {
    type: String,
    unique: true,
    required: [true, "A user must have an email"],
    validate: {
      validator: (value: string) => isEmail(value),
      message: "Invalid email",
    },
  },
  password: {
    type: String,
    minLength: 8,
    required: [true, "A user must have a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must have a passwordConfirm"],
    validate: {
      validator: function (this: TUser, value: string) {
        return value === this.password;
      },
      message: "passwordConfirm must exactly be the same as password",
    },
  },
  passwordChangedAt: Date,
  profilePicture: String,
  firstName: {
    type: String,
  },
  profileURL: {
    type: String,
    required: [true, "User is missing an URL"],
    default: "PROFILE_URL_HERE",
  },
  linkList: [linkSchema],
  shortURL: {
    type: String,
    default: new ShortUniqueId({ length: 10 }).randomUUID(),
  },
});

// Add presave middle ware to validate + haspassword
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // Hash the user password
  this.password = await hashPassword(this.password);

  // Remove password confirm field
  this.passwordConfirm = undefined;
});

export const User = model<TUser>("User", userSchema);
