// Импорт необходимых модулей, библиотек и фукнций 
import express from "express";
import http from 'http'
import path from "path";
import { fileURLToPath } from "url";
import { configApp, PORT } from './config/appConfig.js'
import { connectDB } from './config/mongoConfig.js'
import 'dotenv/config';
import apiRouter from './router/api.js'
import authRouter from './router/auth.js'
import { checkToken, openUserProfile, verifyEmail } from "./controllers/authController.js";
import { grantingAccess } from "./controllers/accessController.js";

// Инициализация Express-приложения
const app = express();
const server = http.createServer(app);
// Получение абсолютного пути к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
configApp(app)

// Асинхронная функция запуска хоста
async function loadHost() {
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.get('/register', async (req, res) => {
    checkToken(req, res);
  });
  
  app.get("/:username", async (req, res) => {
    openUserProfile(req, res)
  });

  app.get("/access/:folderId", async (req, res) => {
    grantingAccess(req, res)
  });

  server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
}
loadHost();

// Подключение к базе данных MongoDB
connectDB(process.env.MongoDB)

// Подключение маршрутов для API и аутентификации
app.use('/api', apiRouter)
app.use('/auth', authRouter)