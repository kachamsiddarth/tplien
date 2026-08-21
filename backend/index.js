require("dotenv").config();
const Groq = require("groq-sdk");

const groq=new Groq({
    apiKey:process.env.GROQ_API_KEY
})
const axios = require("axios");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { StockModel } = require("./models/StockModel");
const { OrdersModel } = require("./models/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/trending", async (req, res) => {
    try {
        const response = await axios.get(
            "https://stock.indianapi.in/trending",
            {
                headers: {
                    "X-API-Key": process.env.STOCK_API_KEY
                }
                
            }
        );

        res.json(response.data);

    } catch (error) {
        console.log(
            "Trending API error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "Failed to fetch trending stocks",
            error: error.response?.data || error.message
        });
    }
});



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

                const currentPrice = stock.nsePrice || stock.bsePrice;

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






app.post("/allOrders", async (req, res) => {
    try {
        const newOrder = new OrdersModel({
            name: req.body.name,
            qty: req.body.qty,
            price: req.body.price,
            mode: req.body.mode
        });

        await newOrder.save();

        res.json(newOrder);

    } catch (error) {
        res.status(500).json({
            message: "Failed to place order",
            error: error.message
        });
    }
});


app.get("/allOrders", async (req, res) => {
    try {
        const allOrders = await OrdersModel.find({});
        res.json(allOrders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch positions",
            error: error.message
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
                upsert: true,
                new: true
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

app.post("/api/ai", async (req, res) => {
    try {
        const { query } = req.body;

        const holdings = await HoldingsModel.find({});
        const orders = await OrdersModel.find({});
        const stocks = await StockModel.find({});

        const trendingResponse = await axios.get(
            "https://stock.indianapi.in/trending",
            {
                headers: {
                    "X-API-Key": process.env.STOCK_API_KEY
                }
            }
        );

        const trendingStocks = trendingResponse.data;

        const prompt = `
You are an AI assistant for a stock portfolio application.

User question:
${query}

USER HOLDINGS:
${JSON.stringify(holdings)}

USER ORDERS:
${JSON.stringify(orders)}

CURRENT STOCK DATA:
${JSON.stringify(stocks)}

TRENDING STOCKS:
${JSON.stringify(trendingStocks)}

Analyze the provided information and answer the user's question.

Use the user's holdings, orders, current stock data,
and trending stocks when relevant.

Do not invent financial data.
If the provided data is insufficient, clearly say so.`;

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: "You are a financial portfolio analysis assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        res.json({
            response: completion.choices[0].message.content
        });

    } catch (error) {
        console.log(
            "AI Error:",
            error.response?.data || error.message
        );

        res.status(500).json({
            message: "AI request failed",
            error: error.response?.data || error.message
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