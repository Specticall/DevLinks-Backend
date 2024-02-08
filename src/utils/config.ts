const { DB_PASSWORD, DB_USERNAME } = process.env;
export const DB_URL = process.env.DB_URL.replace("<PASSWORD>", DB_PASSWORD)
  .replace("<USERNAME>", DB_USERNAME)
  .replace("<COLLECTION>", "DevLinks");

export const BASE_ENDPOINT = "/api";

export const JWT_EXPIRE_TIME = "1d";
