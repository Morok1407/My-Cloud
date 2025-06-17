// Импорт необходимых модулей, библиотек и функций
import express from "express";
import session from "express-session";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import cookiParser from 'cookie-parser'
import dotenv from 'dotenv';

// Путь к папке со всеми важными данными и ключами
dotenv.config({ path: resolve('./.env') })

// Экспорт конфигураций модуля Express
export const configApp = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookiParser())
    app.use(session({
        secret: process.env.SESSION,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
    }));
} 

// Экспорт абсолютных путей, портов и ключей
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const SECRET_KEY = process.env.TOKEN;
export const PORT = process.env.PORT;
export const MAIL = process.env.MAIL;
export const MAILPASS = process.env.MAILPASS;