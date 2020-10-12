import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/api";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";

let app = express();

/* connect to mongoDB */
ConnectDB();

/* config session */
configSession(app);

/* config view engine */
configViewEngine(app);

/* enable body parser */
app.use(bodyParser.urlencoded({extended: true}));

/* enable flash message */
app.use(connectFlash());

/* config passport js */
app.use(passport.initialize());
app.use(passport.session());

/* init all routes */
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Waddup Phong, your server is running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});