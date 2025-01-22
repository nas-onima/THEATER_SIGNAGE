const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const csrf = require("csrf");
const cookieParser = require("cookie-parser");
const { verifyTokenAndCsrf } = require("../routes/middleware");
require("dotenv").config();

const csrfProtection = csrf();
const secret = process.env.JWT_SECRET;

router.use(cookieParser());

router.post("/register", async (req, res) => {
    try {
        const newUser = await new User({
            name: req.body.name,
            userId: req.body.userId,
            password: req.body.password,
        });
        const user = await newUser.save();
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json(e);
    }
})

router.post("/login", async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ userId });
        if (!user) return res.status(404).json("USER NOT FOUND");

        const isPwdMatch = await user.chkPwd(password);
        if (!isPwdMatch) return res.status(401).json('INVALID PASSWORD');
        // JWT生成
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
        // CSRFトークン生成
        const csrfToken = csrfProtection.create(secret);
        // JWTをCookieに保存
        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });
        // CSRFトークンをレスポンスとして返す
        return res.status(200).json({ csrfToken });
    } catch (e) {
        return res.status(500).json(e);
    }
});




module.exports = router;