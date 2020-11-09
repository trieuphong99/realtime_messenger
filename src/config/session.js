import session from "express-session";
import connectMongo from "connect-mongo";

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
let config = (app) => {
  app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000*60*60*24, // number of seconds in a day
    }
  }));
};

module.exports = {
  config: config,
  sessionStore: sessionStore
};