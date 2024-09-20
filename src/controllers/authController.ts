export {}
import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import * as bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import { createJWToken, decodeJWToken } from "../utils/JWT";
dotenv.config();

const SALT_STRING = process.env.SALT_STRING;

exports.postLogin = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    User.findOne({email: req.body.email})
        .then((user) => {
            if(user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(doMatch => {
                        if(doMatch) {
                            const payload = {
                                sub: user._id,
                                passwordUpdatedAt: user.passwordUpdatedAt,
                                iat: Date.now() + 3600000 //set token
                            }
                            const token = createJWToken(payload);
                            return res.status(200).json({message: "Success", token: token})
                        } else {
                            return res.status(400).json({message: "password incorrect"})
                        }
                    })
                    .catch(err => {
                        return res.json(555).json({message: "Register failed", error: err})
                    })
            }
        })
        .catch(err => {
            return res.json(555).json({message: "Login failed", error: err})
        })
}

exports.postRegister = (req:Request, res:Response, next:NextFunction) => {
    const {email, password, confirmPassword} = req.body
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    bcrypt.genSalt(12)
        .then( salt => {
            return bcrypt.hash(password, salt)
        })
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                passwordUpdatedAt: Date.now()
            })
            return user.save();
        })
        .then(result => {
            return res.status(200).json({message: "User save successfully", result: result})
        })
        .catch(err => {
            return res.json(555).json({message: "Register failed", error: err})
        })
}

exports.testAuthen = (req:Request, res:Response, next:NextFunction) => {
    console.log("Test authen")
}