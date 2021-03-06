import mongoose from "mongoose";
import bluebird from "bluebird";

/**
 * Connect to mongoDB
 */

let connectDB = () => {
  mongoose.Promise = bluebird;
  
  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  return mongoose.connect(URI, {
    //useMongoClient: true
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

module.exports = connectDB;