import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import AuthRouter from "./router/auth.router.js";
import foodRouter from "./router/food.router.js";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "Hello World!"
    })
})

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/food', foodRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server Running at http://localhost:${process.env.PORT}/`)
})