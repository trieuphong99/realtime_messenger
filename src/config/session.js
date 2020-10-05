import session from "express-session";
import connectMongo from "connect-mongo";
import { mongo } from "mongoose";

let mongoStore = connectMongo(session);

/**
 * This variable is a place saving session, this case is mongodb
 */

let sessionStore = new mongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true
});
/**
 * config session for app
 */
let configSession = (app) => {
  app.use(session({
    key: "express.sid",
    secret: "mySecret",
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000*60*60*24, // number of seconds in a day
    }
  }));
};

module.exports = configSession;