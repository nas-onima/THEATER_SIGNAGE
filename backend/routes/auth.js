const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const csrf = require("csrf");
const { verifyToken } = require("../routes/middleware");
require("dotenv").config();

const csrfProtection = csrf();
const secret = process.env.JWT_SECRET;

// ユーザー登録処理
router.post("/register", async (req, res) => {
    try {
        const uid = req.body.uid;
        const user = await User.findOne({ uid });
        if (user) {
            return res.status(409).json("USER ALREADY EXISTS");
        }
        const newUser = await new User({
            name: req.body.name,
            uid: uid,
            email: req.body.email,
        });
        const createdUser = await newUser.save();
        return res.status(200).json(createdUser);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
});

// ログインユーザのユーザデータ取得処理
router.get("/user", verifyToken, async (req, res) => {
    try {
        const uid = req.user.uid;
        const user = await User.findOne({ uid });
        if (!user) return res.status(404).json("USER NOT FOUND");

        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json(e);
    }
});

module.exports = router;