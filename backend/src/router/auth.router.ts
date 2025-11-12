import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { loginUser, registerUser } from "../controller/auth.controller.js";

const AuthRouter: ExpressRouter = Router();

AuthRouter.post('/register', registerUser);
AuthRouter.post('/login', loginUser);

export default AuthRouter;