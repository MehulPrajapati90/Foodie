import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { getDbUser, getUserById, loginFoodPartner, loginUser, logoutFoodPartner, logoutUser, registerUser, regsiterFoodPartner } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const AuthRouter: ExpressRouter = Router();

// User Auth
AuthRouter.post('/user/register', registerUser);
AuthRouter.post('/user/login', loginUser);
AuthRouter.post('/user/logout', logoutUser);
AuthRouter.get('/user/user/:id', getUserById);
AuthRouter.get('/user/me', authMiddleware, getDbUser);

// Food Partner Auth
AuthRouter.post('/partner/register', regsiterFoodPartner);
AuthRouter.post('/partner/login', loginFoodPartner);
AuthRouter.post('/partner/logout', logoutFoodPartner);

export default AuthRouter;