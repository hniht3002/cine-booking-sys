export {}
import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";
const adminController = require("../controllers/adminController")

const router: Router = Router();


router.post("/add-movie",  [ 
    body("title").isLength({min: 1}).withMessage("Title is at least 1 character long"), 
    body("description").isLength({min: 1}).withMessage("Description is at least 1 character long"),
    body("poster").isLength({min: 1}).withMessage("Poster is at least 1 character long"),
    body("length").isLength({min: 1}).withMessage("Length is at least 1 character long"),
    body("rate").isLength({min: 1}).withMessage("Rate is at least 1 character long")
                    .custom((value) => {
                        const floatRegex = /^[+-]?([0-9]*[.])?[0-9]+$/;
                        return floatRegex.test(value)        
                    }).withMessage("Not a valid number")
                    .custom((value) => {
                        if(parseFloat(value) > 10.0 || parseFloat(value) < 0.0) {
                            return false;
                        }
                        return true
                    }).withMessage("Rate must be from 0.0 to 10.0"),
    body("directors").isLength({min: 1}).withMessage("Director is at least 1 character long"),
    body("actors").isLength({min: 1}).withMessage("Actor is at least 1 character long"),

], adminController.postAddMovie)

router.get("/edit-movie", adminController.getEditMovie)

router.post("/edit-movie", [ 
    body("title").isLength({min: 1}).withMessage("Title is at least 1 character long"), 
    body("description").isLength({min: 1}).withMessage("Description is at least 1 character long"),
    body("poster").isLength({min: 1}).withMessage("Poster is at least 1 character long"),
    body("length").isLength({min: 1}).withMessage("Length is at least 1 character long"),
    body("rate").isLength({min: 1}).withMessage("Rate is at least 1 character long")
                    .custom((value) => {
                        const floatRegex = /^[+-]?([0-9]*[.])?[0-9]+$/;
                        return floatRegex.test(value)        
                    }).withMessage("Not a valid number")
                    .custom((value) => {
                        if(parseFloat(value) > 10.0 || parseFloat(value) < 0.0) {
                            return false;
                        }
                        return true
                    }).withMessage("Rate must be from 0.0 to 10.0"),
    body("directors").isLength({min: 1}).withMessage("Director is at least 1 character long"),
    body("actors").isLength({min: 1}).withMessage("Actor is at least 1 character long"),

], adminController.postEditMovie)

export default router