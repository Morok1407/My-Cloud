import mongoose from "mongoose";

// Инициализация таблицы пользователей в базе данных MongoDB
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
        minlength: [3, 'Имя должно содержать минимум 3 символа'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'], 
        unique: true, 
        match: [/.+@.+\..+/, 'Введите корректный email'], 
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Пароль обязателен'], 
        minlength: [6, 'Пароль должен содержать минимум 6 символов'], 
    },
    SubscriptionType: {
        type: String,
        default: 'Free'
    },
    RemainingPeriod: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    folderPath: { type: String }
})

const User = mongoose.model('User', userSchema);

export default User;