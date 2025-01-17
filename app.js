import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import User from './models/user.js';
import session from "express-session";
import bcrypt from "bcrypt";
import 'dotenv/config';
import router from './router/api.js'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "cookie",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
}));

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

mongoose.connect(process.env.MongoDB, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Connection error', err);
});

app.use('/api', router)

app.post('/register', async (req, res) => {
    const { name, email, password, rePassword, captchaResponse } = req.body;

    if (password !== rePassword) {
      return res.json({ success: false, message: 'Пароли не совпадают' });
    }

    if (captchaResponse !== req.session.captcha) {
      return res.json({ success: false, message: 'Неверный код с картинки' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Пользователь с таким email уже существует' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({ name, email, password: hashedPassword });
  
    try {
      await newUser.save();
      res.json({ success: true, message: 'Регистрация успешна!' });
    } catch (err) {
      res.json({ success: false, message: 'Ошибка при регистрации: ' + err.message });
    }
});