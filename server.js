const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketapi = require('./sockets');
dotenv.config({ path: "./config.env" });
const cron = require("node-cron");
const app = require("./app");

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 4500;
const server = app.listen(port, () => {
  console.log(`App is running in  on port "${port}"`);
});
socketapi.io.attach(server);