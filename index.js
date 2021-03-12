// require your server and launch it here
const server = require("./api/server");

// server.listen(5000, () => {
//   console.log("\n*** Server Running on http://localhost:5000 ***\n");
// });

require("dotenv").config();
const path = require("path");
const express = require("express");

// const server = express();

// server.use(express.json());
server.use(express.static(path.join(__dirname, "client/build")));

console.log(process.env.NODE_ENV);

// on Heroku machine, an env variable is called "NODE_ENV" -> "production"
if (process.env.NODE_ENV === "development") {
  const cors = require("cors");
  server.use(cors());
}

// our API comes earlier in the pipeline
server.get("/api/hello", (req, res) => {
  res.json({ message: "hello" });
});

// catch-all that just sends back index.html
server.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
