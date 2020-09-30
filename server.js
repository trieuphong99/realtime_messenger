import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";

let app = express();

let hostname = "localhost";
let port = 8017;
/* connect to mongoDB */
ConnectDB();

app.get("/test-database", async (req, res) => {
  try {
    let item = {
      userId: "17020956",
      contactId: "17020956",
    };
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, hostname, () => {
  console.log(`Waddup Phong, your server is running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});