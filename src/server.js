import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/api";
import bodyParser from "body-parser";

let app = express();

/* connect to mongoDB */
ConnectDB();

/* config view engine */
configViewEngine(app);

/* enable body parser */
app.use(bodyParser.urlencoded({extended: true}));
/* init all routes */
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Waddup Phong, your server is running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});