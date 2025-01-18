import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { configApp } from './config/appConfig.js'
import { connectDB } from './config/mongoConfig.js'
import 'dotenv/config';
import apiRouter from './router/api.js'
import authrouter from './router/auth.js'

const app = express();
const PORT = process.env.PORT;
configApp(app)

function loadHost() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(express.static(path.join(__dirname, "public")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
}
loadHost();

connectDB(process.env.MongoDB)

app.use('/api', apiRouter)
app.use('/auth', authrouter)