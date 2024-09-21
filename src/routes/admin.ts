export {}
import { Router } from "express";
import { body } from "express-validator";
const adminController = require("../controllers/adminController")

const router: Router = Router();

router.post("/add-movie",  [ 
    body("title").isLength({min: 1}).withMessage("Title is at least 1 character long"), 
    body("description").isLength({min: 1}).withMessage("Description is at least 1 character long")
], adminController.postAddMovie)

export default router