export {}
import { Decimal128, model, Schema, Types, Document, ObjectId  } from "mongoose";

export interface IShow extends Document {
    movieId: string,
    roomId: string,
    seatMap: Array<ObjectId | null >,
    ticketPrice: Decimal128,
    ticketQuantity: Number,
    startTime: Date,
    endTime: Date,
}

const showSchema :Schema<IShow> = new Schema({
    movieId: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true,
    },
    ticketPrice: {
        type: Types.Decimal128,
        required: true,
    },
    ticketQuantity: {
        type: Number,
        require: true
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

const Show = model<IShow>("Show", showSchema)
export default Show 