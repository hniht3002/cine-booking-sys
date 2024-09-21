export {}
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Movie from "../models/movie";

exports.postAddMovie = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    const user = res.locals.user;

    const movie = new Movie({
        title: req.body.title,
        description: req.body.description,
        createdBy: user._id,
    })

    movie.save()
        .then((result:Document) => {
            return res.status(200).json({message: "Add movie successfully", result: result})
        })

        .catch((err:Error) => {
            return res.status(555).json({message: "Add movie failed", error: err})
        })
}