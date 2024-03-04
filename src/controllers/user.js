const { User, UserToken } = require('../models/user');
const { createToken, verifyToken } = require('../services/authServices');
const { validEmail, validPwd } = require('../utils/validator');
const bcrypt = require('bcrypt');


const register = async (req, res) => {
    try {
        const body = req.body;
        const { username, email, phone, address, answer, password, cnfpassword } = body;
        if (!(username && email && phone && address && answer && password && cnfpassword)) {
            return res.status(400).json({ status: false, message: "All fields are required" })
        }
        if (!validEmail(email)) {
            return res.status(400).json({ status: false, message: "Enter a valid email" })
        }
        const phoneNumber = await User.findOne({ phone });
        if (phoneNumber) {
            return res.status(400).json({ status: false, message: "Alrady exist number use another!!" })
        }
        const userExit = await User.findOne({ email: email.toLowerCase() });
        if (userExit) {
            return res.status(400).json({ status: false, message: "User already exist, Please login now!!" })
        }
        if (!validPwd(password && cnfpassword)) {
            return res.status(400).json({ status: false, message: "Password should be 8 characters long and must contain one of 0-9,A-Z,a-z and special characters" })
        }

        if (password !== cnfpassword) {
            return res.status(400).json({ status: false, message: "Password does't match" })
        } else {
            body.password = await bcrypt.hash(body.password, 12)
        }
        const findCount = await User.find({}).sort({ userId: -1 }).limit(1)
        let id;
        if (findCount.length === 0) {
            id = 1;
        } else {
            id = parseInt(findCount[0].userId) + 1;
        }
        let obj = {
            userId: id,
            username,
            phone,
            email: email.toLowerCase(),
            address,
            userType: body.userType,
            answer,
            password: body.password
        }
        const saveUser = await User.create(obj);
        return res.status(201).json({ status: true, message: "User Registerd Successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const login = async (req, res) => {
    try {
        const body = req.body;
        const { email, password } = body;
        if (!(email && password)) {
            return res.status(400).json({ status: false, message: "Email and password is required!!" })
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" })
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({ status: false, message: "Invalid credentials" })
        }
        const userObj = {
            userId: user.userId,
            name: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            userType: user.userType,
            profile: user.profile,
            answer: user.answer
        }
        const verification = await createToken(req, res, userObj);
        const userData = await User.findOne({ email: email.toLowerCase() }).select({ _id: 0, __v: 0, password: 0, createdAt: 0, updatedAt: 0 })
        if (verification.isVerified) {
            res.status(200).json({
                status: true,
                message: 'Login successful',
                data: userData,
                token: verification.token,
                refreshToken: verification.refreshToken,
            });
        } else {
            res.status(401).json({ status: false, message: 'UnAuthorized user!' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const logOut = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            await UserToken.findOneAndUpdate({ token: verification.token }, { active: 0, new: true });
            return res.status(200).json({ status: true, message: "Succesfully logged out!" })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Internal Server Error" })
    }
}

const updateProfile = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const userId = verification.data.data.userId;
            const { username, phone, address } = req.body
            const user = await User.findOneAndUpdate({ userId: userId }, {
                $set: {
                    username: username ? req.body.username : username,
                    phone: phone ? req.body.phone : phone,
                    address: address ? req.body.address : address
                }
            }, { new: true })
            if (!user) {
                return res.status(404).json({ status: false, message: "User not found" })
            }
            return res.status(200).json({ status: true, message: "Updated Successfully", })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

const userDetails = async (req, res) => {
    try {
        const verification = await verifyToken(req, res);
        if (verification.isVerified) {
            const user = await User.findOne({}).select({ _id: 0, __v: 0, password: 0 })
            return res.status(200).json({ status: true, message: "Get user details", user })
        } else {
            return res.status(401).json({ status: false, message: verification.message })
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { register, login, logOut, updateProfile, userDetails }