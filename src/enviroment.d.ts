declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      DB_URL: string;
      DB_PASSWORD: string;
      DB_USERNAME: string;
      BCRYPT_SALT: number;
      JWT_STRING: string;
      NODE_ENV: "development" | "production";
      // Add enviroment varibles type definitions here
    }
  }
}

// Converts this file into the module system.
export {};
