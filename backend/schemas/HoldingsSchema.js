const mongoose = require("mongoose");

const HoldingsSchema = new mongoose.Schema({
    name: String,
    qty: Number,
    avg: Number,
    price: Number,
    net: String,
    day: String,
    investment: Number,
    currentValue: Number,
    pnl: Number,
    percentChange: Number
});


const HoldingsModel = mongoose.model("holding", HoldingsSchema);

module.exports = { HoldingsModel };
