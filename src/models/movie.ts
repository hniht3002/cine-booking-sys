export {}
import { Decimal128, model, Schema, Types, Document  } from "mongoose";

const mongoose = require("mongoose")

export interface IMovie extends Document {
    title: string;
    description: string;
    poster: string;
    length: string;
    rate: Decimal128;
    genre: string;
    directors: Array<string>;
    actors: Array<string>;
    createdBy: string;
    createdAt: Date;
}

const movieSchema : Schema<IMovie> = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },

    poster: {
        type: String,
        require: true
    },

    directors: {
        type: [String],
        require: true
    },

    actors: {
        type: [String],
        require: true
    },

    length: {
        type: String,
        require: true
    },

    genre: {
        type: String,
        require: true
    },

    rate: {
        type: Types.Decimal128,
        require: true
    },

    createdBy: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }



})

const Movie = model<IMovie>("Movie", movieSchema);
export default Movie;