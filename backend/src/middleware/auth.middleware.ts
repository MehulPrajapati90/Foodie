import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { client } from "../config/db.js";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!)

        if (!decoded || typeof decoded !== "object" || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        const user = await client.user.findFirst({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("AuthMiddleware error:", error);
        return res.status(401).json({
            success: false,
            message: "Authentication failed",
        });
    }
};
