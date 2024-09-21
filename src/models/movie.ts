export {}
import { ObjectId, Schema } from "mongoose";

const mongoose = require("mongoose")

interface IMovie extends Document {
    title: string;
    description: string;
    createdAt: Date;
    createdBy: String;
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

    createdBy: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }



})

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;