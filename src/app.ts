// src/index.js
import express, { Express } from "express";
import dotenv from "dotenv";
const mongoose = require("mongoose")
import multer from "multer";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin"
import movieRoutes from "./routes/movie"

dotenv.config();

const authenticationMiddleware = require("./middlewares/authenticationMiddleware")
const authorizationMiddleware = require("./middlewares/authorizationMiddleware")



const upload = multer()

const port = process.env.PORT || 3000;

const app: Express = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}))

app.use(upload.array(""))

app.use("/auth", authRoutes)
app.use("/admin", authenticationMiddleware, authorizationMiddleware, adminRoutes)
app.use("/movie", movieRoutes)

mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Connected")
    app.listen(port);
  })

  .catch((err:Error) => {
    console.log(err)
  })