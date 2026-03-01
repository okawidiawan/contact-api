import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import userController from "../controller/user-controller";

const userRouter = express.Router();

userRouter.use(authMiddleware);
userRouter.get("/api/users/current", userController.get);

export { userRouter };
