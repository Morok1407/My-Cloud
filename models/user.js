import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Имя обязательно'],
        minlength: [3, 'Имя должно содержать минимум 3 символа'],
    },
    email: {
        type: String,
        required: [true, 'Email обязателен'], 
        unique: true, 
        match: [/.+@.+\..+/, 'Введите корректный email'], 
    },
    password: {
        type: String,
        required: [true, 'Пароль обязателен'], 
        minlength: [6, 'Пароль должен содержать минимум 6 символов'], 
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    folderPath: { type: String }
})

const User = mongoose.model('User', userSchema);

export default User;