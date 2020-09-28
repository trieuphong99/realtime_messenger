import express from "express"

let app = express();
let hostname = "localhost";
let port = 8017;

app.get("", (req, res) => {
  res.send("<h1>Welcome Stormalic!</h1>");
});

app.listen(port, hostname, () => {
  console.log(`Waddup Phong, your server is running at ${hostname}:${port}/`);
});