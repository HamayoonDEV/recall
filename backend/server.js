import express from "express";
import { PORT } from "./config/index.js";
import connectDb from "./database/database.js";
import router from "./routes/index.js";
import errorHandler from "./middleWare/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const corsOptions = {
  credentials: true,
  origin: ["recall-one.vercel.app"],
};

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());
connectDb();
app.use(express.json({ limit: "50mb" }));
app.use(router);
app.use("/storage", express.static("storage"));
app.use(errorHandler);
app.listen(PORT, console.log(`server is running on PORT:${PORT}`));
