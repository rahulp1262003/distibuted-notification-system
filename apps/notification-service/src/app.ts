import express from "express";
import notificationRoutes from "./routes/notification.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use("/notifications", notificationRoutes);

// Global Error Handler
app.use(errorMiddleware);

export default app;