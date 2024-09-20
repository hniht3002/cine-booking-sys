export {}
import { Router } from "express";
import { body } from "express-validator";
import User from "../models/user";
const authController = require("../controllers/authController")
const authMiddleware = require("../middlewares/authMiddlewares")

const router: Router = Router();

router.post("/login", [
    body("email")
    .trim().isEmail()
    .custom((value, {req}) => {
        return User.findOne({email: value})
            .then(user => {
                if(!user) {
                    return Promise.reject("User not found")
                }
            })
            .catch(err => {
                throw new Error(err)
            })
    }),
    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters")
], authController.postLogin)

router.post("/register", [
    body("email").trim()
    .isEmail()
    .custom((value, {req}) => {
        return User.findOne({email: value})
            .then(user => {
                if(user) {
                    return Promise.reject("Email exist")
                }
            })
            .catch(err => {
                throw new Error(err)
            })
    }),

    body("password").isLength({min: 6}).withMessage("Password must be at least 6 characters"),

    body("confirmPassword").custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error("Confirm password does not match!")
        }
        return true
    })

], authController.postRegister)

router.post("/test", authMiddleware, authController.testAuthen)

export default router;