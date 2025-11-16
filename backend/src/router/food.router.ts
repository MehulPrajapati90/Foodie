import { Router } from "express";
import { Router as ExpressRouter } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createFood, getFoodItems, getFoodPartnerById, getSaveFood, likeFood, saveFood } from "../controller/food.controller.js";
import multer from "multer";
import { foodMiddleware } from "../middleware/food.middleware.js";

const upload = multer({
    storage: multer.memoryStorage(),
})

const foodRouter: ExpressRouter = Router();

// Food Partner
foodRouter.get("/partner/:id", authMiddleware, getFoodPartnerById);

// Food Specifically
foodRouter.get('/', authMiddleware, getFoodItems);
foodRouter.post('/like', authMiddleware, likeFood);
foodRouter.get('/save', authMiddleware, getSaveFood);
foodRouter.post('/save', authMiddleware, saveFood);

// Add food + food image
foodRouter.post('/create', foodMiddleware, upload.single("food"), createFood)

export default foodRouter;