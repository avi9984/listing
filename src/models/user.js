const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: { type: Number },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    address: { type: Array },
    userType: {
        type: String,
        enum: ['user', 'vendors', 'admin'],
        required: true,
        default: 'user'
    },
    profile: {
        type: String,
        default: 'https://www.flaticon.com/free-icon/user_552721'
    },
    answer: { type: String, require: true },
    password: { type: String, required: true, minLenght: 8, }
}, { timestamps: true })


const userToken = new mongoose.Schema({
    userId: { type: Number },
    token: { type: String },
    refreshToken: { type: String },
    active: { type: Number },
    expireIn: { type: Number }
})

const User = mongoose.model("User", userSchema);
const UserToken = mongoose.model("UserToken", userToken);

module.exports = { User, UserToken }