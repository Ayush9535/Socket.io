const { UserModel } = require("../Model/UserModel.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BoyProfile = "https://avatar.iran.liara.run/public/9"
const GirlProfile = "https://avatar.iran.liara.run/public/53"

async function LoginController(req,res){
    try {
        const { username, password } = req.body;
        let user = await UserModel.findOne({ username: username });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ username: user.username, id:user._id }, process.env.JWT_SECRET);
                res.cookie("token", token, { httpOnly: true});
                return res.status(200).json({ message: "User logged in successfully" , token: token , id:user._id});
            } else {
                return res.status(401).json({ message: "Password is incorrect" });
            }
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function RegisterController(req,res){
    try {
        const { username, email, password} = req.body;
        let user = await UserModel.findOne({ $or: [{ username: username }, { email: email }] });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }
        let hashedPass = await bcrypt.hash(password, 10);
        let newUser = new UserModel({ username: username, email: email, password: hashedPass, profile:BoyProfile});
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    LoginController,
    RegisterController
}