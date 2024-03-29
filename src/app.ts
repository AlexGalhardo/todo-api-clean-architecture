import "dotenv/config";
import compression from "compression";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";

import routes from "./routes";
import { HttpStatusCode } from "./utils/HttpStatusCode";

import "express-async-errors";

const app = express();

export default app
    .use(express.json())
    .use(cors())
    .use(compression())
    .use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false }))
    .use("/api", routes)
    .use((error: Error, _: Request, res: Response, next: NextFunction) => {
        if (error instanceof Error) {
            return res.status(HttpStatusCode.BAD_REQUEST).json({
                success: false,
                error,
            });
        }

        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error,
        });

        return next();
    })
    .get("/", (_, res: Response) => {
        return res.status(HttpStatusCode.OK).json({
            success: true,
            message: "ToDo API Clean Architecture is on, lets goo!",
        });
    });
