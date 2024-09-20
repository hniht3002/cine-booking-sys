export {}
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const showSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    movieId: {
        type: String,
        require: true
    },
    createdOn: {
        type: Date,
        require: true
    },
    startTime: {
        type: Date,
        require: true
    },
    endTime: {
        type: Date,
        require: true
    },
    showSession: {
        cinemaId: {type: String},
        seatMap: {type: Array}
    }
})

module.exports = mongoose.model("Show", showSchema);