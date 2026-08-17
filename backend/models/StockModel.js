const { model } = require("mongoose");

const { StockSchema } = require("../schemas/StockSchema");

const StockModel = new model("stock", StockSchema);

module.exports = { StockModel };