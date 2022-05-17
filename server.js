require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const initRoutes = require("./routes/candidateRoutes");
global.__basedir = __dirname;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileupload());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("Connection Established"));

initRoutes(app);

const PORT = 5000;
app.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("server listening on PORT", PORT);
});
