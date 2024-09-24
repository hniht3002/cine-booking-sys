export {}
import { NextFunction, Request, Response } from "express";
import Movie, { IMovie } from "../models/movie";
import { validationResult } from "express-validator";

exports.search = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    const title = req.query.title;
    
    Movie.find({"title": {"$regex": title}})
        .then((movie) => {
            return res.json({message: "Find movie successfully", movie: movie})
        })

        .catch((err:Error) => {
            return res.status(555).json({message: "Find movie failed", error: err})
        })
}

