import { taskRouter } from "./task.route";
import { Express } from "express";
import { userRoutes } from "./user.route";
import *as authMiddleware from "../middleware/auth.middleware"

const mainV1Router=(app:Express):void=>{
    const version ="/api/v1"
    app.use(version+"/tasks",authMiddleware.requireAuth,taskRouter);
    app.use(version+"/users",userRoutes);
}

export default mainV1Router;