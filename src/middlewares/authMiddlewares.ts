import { Request, Response, NextFunction } from "express";
import { createJWToken, decodeJWToken, verifyJWToken } from "../utils/JWT";

module.exports = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization?.slice(7);

    if(!token) {
        return res.status(401).json({message: "Unauthorized"})
    }

    try {
        const [header, payload, signature] = decodeJWToken(token)

        if(!verifyJWToken(header, payload, signature)) {
            return res.status(401).json({message: "Token incorrect"})
        }

        if(payload.iat < Date.now()) {
            return res.status(401).json({message: "Token expires"})
        }

        res.locals = payload

    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }

    next()
}