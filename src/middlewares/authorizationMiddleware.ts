import { NextFunction, Request, Response } from "express";

module.exports = (req:Request, res:Response, next:NextFunction) => {
    const user = res.locals.user;

    if(user.role === "admin") {
        next()
    } else {
        return res.status(401).json({message: "Unauthorized, only admin can access this role"})
    }
}