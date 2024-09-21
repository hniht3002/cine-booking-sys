import { Request, Response, NextFunction } from "express";
import { createJWToken, decodeJWToken, verifyJWToken } from "../utils/JWT";
import User from "../models/user";

module.exports = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization?.slice(7);

    if(!token) {
        return res.status(401).json({message: "Unauthenticated, please login!"})
    }

    try {
        const [header, payload, signature] = decodeJWToken(token)

        if(!verifyJWToken(header, payload, signature)) {
            return res.status(401).json({message: "Token incorrect"})
        }

        if(payload.iat < Date.now()) {
            return res.status(401).json({message: "Token expires"})
        }

        User.findById(payload.sub)
            .then(user => {
                if(!user) {
                    return res.status(401).json({message: "User not found"})
                }

                if(user.passwordUpdatedAt.toISOString() !== payload.passwordUpdatedAt) {
                    return res.status(401).json({message: "Password updated! Please login"})
                }
                
                res.locals.user = user

                next()
            })
            .catch(e => console.log(e))
            

    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }
}