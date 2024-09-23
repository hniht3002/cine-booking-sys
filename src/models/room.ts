export {}
import { Decimal128, model, Schema, Types, Document, ObjectId  } from "mongoose";

export interface IRoom extends Document {
    movieId: string,
    roomNumber: string,
    seatMap: Array<ObjectId | 0 >,
    ticketPrice: Decimal128,
    startTime: Date,
    endTime: Date,
}

const roomSchema :Schema<IRoom> = new Schema({
    roomNumber: {
        type: String,
        required: true,
    },
    seatMap: {
        type: [],
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
})

const Show = model<IRoom>("Room", roomSchema)
module.exports = Show;