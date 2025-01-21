import express from "express";
import session from "express-session";

export const configApp = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(session({
        secret: process.env.SESSION,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
    }));
} 