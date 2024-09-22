export {}
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Movie, { IMovie } from "../models/movie";

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
        length: req.body.length,
        rate: req.body.rate,
        directors: req.body.directors.split(","),
        actors: req.body.actors.split(","),
    })

    movie.save()
        .then((movie:IMovie) => {
            return res.status(200).json({message: "Add movie successfully", result: movie})
        })

        .catch((err:Error) => {
            return res.status(555).json({message: "Add movie failed", error: err})
        })
}

exports.getEditMovie = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    const id = req.query.id;

    Movie.findById(id)
        .then((movie:IMovie|null) => {
            if(!movie) {
                return res.status(404).json({message: "Get editing movie failed", error: "Movie not found"})
            }

            return res.status(200).json({message: "Success", result: movie})
        })

        .catch((err:Error) => {
            return res.status(555).json({message: "Get editing movie failed", error: err})
        })
}

exports.postEditMovie = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    const id = req.body.id

    Movie.findById(id)
        .then((movie:IMovie|null) => {

            if(!movie) {
                return  Promise.reject({ message: "Movie not found" })
            }

            movie.title = req.body.title;
            movie.description = req.body.description;
            movie.length = req.body.length;
            movie.rate = req.body.rate;
            movie.directors = req.body.directors.split(",");
            movie.actors = req.body.actors.split(",");

            return movie.save();
        })

        .then((result: IMovie) => {
            
            return res.status(200).json({message: "Success", result: result})
        })

        .catch((err:Error) => {
            return res.status(555).json({message: "Edit movie failed", error: err})
        })
}