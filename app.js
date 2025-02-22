import express from "express";
import { WebSocketServer } from "ws";
import http from 'http'
import path from "path";
import { fileURLToPath } from "url";
import { configApp, PORT } from './config/appConfig.js'
import { connectDB } from './config/mongoConfig.js'
import 'dotenv/config';
import { wsController } from "./controllers/wsController.js";
import apiRouter from './router/api.js'
import authRouter from './router/auth.js'

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configApp(app)

function loadHost() {
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
}
loadHost();

wsController(wss)

connectDB(process.env.MongoDB)

app.use('/api', apiRouter)
app.use('/auth', authRouter)