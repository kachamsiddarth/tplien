require("dotenv").config();

const axios = require("axios");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { StockModel } = require("./models/StockModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
app.use(cors());


app.get("/allHoldings", async (req, res) => {
    try {
        const allHoldings = await HoldingsModel.find({});

        const holdingsWithLiveData = await Promise.all(
            allHoldings.map(async (holding) => {

                const stock = await StockModel.findOne({
                    symbol: holding.name
                });
                if (!stock) {
                    return {
                        ...holding.toObject(),
                        price: null,
                        investment: holding.qty * holding.avg,
                        currentValue: null,
                        pnl: null
                    };
                }

                const currentPrice = stock.nsePrice;

                const investment = holding.qty * holding.avg;

                const currentValue = holding.qty * currentPrice;

                const pnl = currentValue - investment;

                return {
                    ...holding.toObject(),
                    price: currentPrice,
                    investment: investment,
                    currentValue: currentValue,
                    pnl: pnl,
                    percentChange: stock.percentChange
                };
            })
        );

        res.json(holdingsWithLiveData);

    } catch (error) {
        console.log("Error fetching holdings:", error.message);

        res.status(500).json({
            message: "Failed to fetch holdings"
        });
    }
});


app.get("/allPositions", async (req, res) => {
    try {
        const allPositions = await PositionsModel.find({});
        res.json(allPositions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch positions",
            error: error.message
        });
    }
});



app.get("/api/stocks/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();

        const response = await axios.get(
            "https://stock.indianapi.in/stock",
            {
                params: {
                    name: symbol
                },
                headers: {
                    "X-API-Key": process.env.STOCK_API_KEY
                }
            }
        );

        const data = response.data;

        const stock = await StockModel.findOneAndUpdate(
            {
                symbol: symbol
            },
            {
                symbol: symbol,
                companyName: data.companyName,
                industry: data.industry,
                nsePrice: data.currentPrice?.NSE,
                bsePrice: data.currentPrice?.BSE,
                percentChange: data.percentChange,
                updatedAt: new Date()
            },
            {
                new: true,
                upsert: true
            }
        );

        res.json(stock);

    } catch (error) {
        console.log(
            "Stock API error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to fetch and save stock data",
            error: error.response?.data || error.message
        });
    }
});




app.get("/api/stocks", async (req, res) => {
    try {
        const stocks = await StockModel.find({});
        res.json(stocks);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch stocks",
            error: error.message
        });
    }
});

app.get("/allStocks", async (req, res) => {
    try {
        const allStocks = await StockModel.find({});
        res.json(allStocks);
    } catch (error) {
        console.log("Error fetching stocks:", error.message);

        res.status(500).json({
            message: "Failed to fetch stocks"
        });
    }
});



mongoose
    .connect(uri)
    .then(() => {
        console.log("DataBase is connected!!");

        app.listen(PORT, () => {
            console.log(`App has started on port ${PORT}!!`);
        });
    })
    .catch((error) => {
        console.log("Database connection error:", error.message);
    });