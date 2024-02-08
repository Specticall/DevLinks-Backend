import { connect } from "mongoose";
import { DB_URL } from "./utils/config";

connect(DB_URL)
  .then(() => {
    console.log("Connected To Database...");
  })
  .catch((error) => {
    console.log(`Failed To Connect to Database : ${error.message}`);
  });
