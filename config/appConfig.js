import express from "express";
import session from "express-session";
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import cookiParser from 'cookie-parser'
import dotenv from 'dotenv';

dotenv.config({ path: resolve('./.env')})

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

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const SECRET_KEY = process.env.TOKEN;
export const PORT = process.env.PORT