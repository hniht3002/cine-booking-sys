import { Request, Response, NextFunction } from "express";
import { createJWToken, decodeJWToken } from "../utils/JWT";

module.exports = (req:Request, res:Response, next:NextFunction) => {
    const token = req.headers.authorization?.slice(7);

    if(!token) {
        return res.status(401).json({message: "Unauthorized"})
    }

    try {
        const [header, payload, signature] = decodeJWToken(token)

        console.log(payload)
        if(payload.iat < Date.now()) {
            return res.status(401).json({message: "Token expires"})
        }

        return res.json({payload: payload})

    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }

    next()
}