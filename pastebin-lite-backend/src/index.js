import dotenv from "dotenv";
dotenv.config();

import express from "express";
import healthRoutes from "./routes/health.js";
import pasteRoutes from "./routes/paste.js";

const app = express();
app.use(express.json());

app.use("/api", healthRoutes);
app.use("/api", pasteRoutes);
app.use("/", pasteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
