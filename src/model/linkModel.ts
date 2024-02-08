import { Schema } from "mongoose";

type TLink = {
  platform: string;
  URL: string;
};

export const linkSchema = new Schema<TLink>({
  platform: {
    type: String,
    required: [true, "A link must contain a platform"],
  },
  URL: {
    type: String,
    required: [true, "A link must contain a URL"],
  },
});
