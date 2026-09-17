import express from "express";
import cors from "cors";
import creditoRoutes from "./routes/credito.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function crearApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/creditos", creditoRoutes);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}