// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
const mongoose = require("mongoose")
import multer from "multer";

import authRoutes from "./routes/auth";
import bodyParser from "body-parser";

dotenv.config();

const upload = multer()

const port = process.env.PORT || 3000;

const app: Express = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}))

app.use(upload.array(""))

app.use("/auth", authRoutes)

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Connected")
    app.listen(port);
  })

  .catch((err:Error) => {
    console.log(err)
  })