export {}
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Movie, { IMovie } from "../models/movie";
import Show, { IShow } from "../models/show";

// admin movie usecase

exports.getMovies = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    let page:number = 1;
    if(req.query.page) {
        page = Number(req.query.page)
    }
    const ITEM_PER_PAGE = 2;
    Movie.find()
        .skip((page - 1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
        .then((movies: Array<IMovie>) => {
            return res.status(200).json({message: "Get movie successfully", result: movies})
        })
        .catch((err:Error) => {
            return res.status(555).json({message: "Get movie failed", error: err})
        })
}

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

exports.deleteMovie = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    const userId = res.locals.user._id;
    const movieId = req.body.movieId;

    Movie.findById(movieId)
        .then((movie:IMovie|null) => {
            if(!movie) {
                return res.status(404).json({message: "Movie not found"})
            }

            if(movie.createdBy !== userId.toString()) {
                return res.status(401).json({message: "Only user who created can delete"})
            }

            return movie.deleteOne()
                .then((result:Document) => {
                    return res.status(200).json({message: "Success", result: result})
                })
        })
        
        .catch((err:Error) => {
            return res.status(555).json({message: "Delete movie failed", error: err})
        })

}


//admin show usecase

exports.getShows = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    let page:number = 1;
    if(req.query.page) {
        page = Number(req.query.page)
    }
    const ITEM_PER_PAGE = 2;
    Show.find()
        .skip((page - 1)*ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
        .then((shows: Array<IShow>) => {
            return res.status(200).json({message: "Get shows successfully", result: shows})
        })
        .catch((err:Error) => {
            return res.status(555).json({message: "Get shows failed", error: err})
        })
}

exports.postAddShow = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    const startTime = new Date(req.body.startTime)
    const endTime = new Date(req.body.endTime)
    Show.findOne({
        roomId: req.body.roomId, 
        $or: [
            {startTime: {$lt: startTime, $gte: endTime}},
            {endTime: {$gt: startTime, $lte: endTime}},
            {startTime: {$lte: startTime, $gte: endTime}},
        ]
    })
        .then(existingShow => {
            if(existingShow) {
                return res.status(409).json({message: `Duplicated time with show ${existingShow._id}`})
            }

            const show = new Show({
                movieId: req.body.movieId,
                roomId: req.body.roomId,
                ticketPrice: req.body.ticketPrice,
                ticketQuantity: req.body.ticketQuantity,
                startTime: startTime,
                endTime: endTime,
            })
        
            show.save()
                .then((show:IShow) => {
                    return res.status(200).json({message: "Add show successfully", result: show})
                })
        })

        .catch((err:Error) => {
            return res.status(555).json({message: "Add show failed", error: err})
        })

    
}

exports.getEditShow = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    const id = req.query.id;

    Show.findById(id)
        .then((show:IShow|null) => {
            if(!show) {
                return res.status(404).json({message: "Get editing show failed", error: "Show not found"})
            }

            return res.status(200).json({message: "Success", result: show})
        })

        .catch((err:Error) => {
            return res.status(555).json({message: "Get editing show failed", error: err})
        })
}

exports.postEditShow = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.json({message: "Has errors", errors: errors})
    }

    const id = req.body.id

    Show.findById(id)
        .then((show:IShow|null) => {

            if(!show) {
                return  Promise.reject({ message: "Movie not found" })
            }

            return show;
        })

        .then((show) => {
            const startTime = new Date(req.body.startTime)
            const endTime = new Date(req.body.endTime)

            return Show.findOne({
                roomId: req.body.roomId, 
                $or: [
                    {startTime: {$lt: startTime, $gte: endTime}},
                    {endTime: {$gt: startTime, $lte: endTime}},
                    {startTime: {$lte: startTime, $gte: endTime}},
                ]
            })
                .then(existingShow => {
                    if(existingShow && existingShow._id === id) {
                        return res.status(409).json({message: `Duplicated time with show ${existingShow._id}`})
                    }

                    show.movieId = req.body.movieId,
                    show.roomId = req.body.roomId,
                    show.ticketPrice = req.body.ticketPrice,
                    show.ticketQuantity = req.body.ticketQuantity,
                    show.startTime = startTime,
                    show.endTime = endTime
                
                    return show.save()
                        .then((show:IShow) => {
                            return res.status(200).json({message: "Update show successfully", result: show})
                        })
                })
        })

        .catch((err:Error) => {
            return res.status(555).json({message: "Edit movie failed", error: err})
        })
}