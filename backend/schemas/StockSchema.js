const { Schema } = require("mongoose");

const StockSchema = new Schema({
    symbol: {
        type: String,
        required: true,
        unique: true,
    },

    companyName: {
        type: String,
        required: true,
    },

    industry: {
        type: String,
    },

    nsePrice: {
        type: Number,
    },

    bsePrice: {
        type: Number,
    },

    percentChange: {
        type: Number,
    },

    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = { StockSchema };