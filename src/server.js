import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/api";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index"
import configSocketIo from "./config/socketio";
import cookieParser from "cookie-parser";

// import pem from "pem";
// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err;
//   }

//   let app = express();

//   /* connect to mongoDB */
//   ConnectDB();

//   /* config session */
//   configSession(app);

//   /* config view engine */
//   configViewEngine(app);

//   /* enable body parser */
//   app.use(bodyParser.urlencoded({extended: true}));

//   /* enable flash message */
//   app.use(connectFlash());

//   /* config passport js */
//   app.use(passport.initialize());
//   app.use(passport.session());

//   /* init all routes */
//   initRoutes(app);

//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//     console.log(`Waddup Phong, your server is running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
//   });
// });

let app = express();

/* init server with socket.io & express app */
let server = http.createServer(app);
let io = socketio(server);

/* connect to mongoDB */
ConnectDB();

/* config session */
session.config(app);

/* config view engine */
configViewEngine(app);

/* enable body parser */
app.use(bodyParser.urlencoded({extended: true}));

/* enable flash message */
app.use(connectFlash());

/* user cookie parser */
app.use(cookieParser);

/* config passport js */
app.use(passport.initialize());
app.use(passport.session());

/* init all routes */
initRoutes(app);

/* config socket io */  
configSocketIo(io, cookieParser, session.sessionStore);

/* init all sockets */
initSockets(io);

server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Waddup Phong, your server is running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});