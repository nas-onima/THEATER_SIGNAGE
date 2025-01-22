require("dotenv").config();
const jwt = require("jsonwebtoken");
const csrf = require("csrf");
const csrfProtection = new csrf();

const secret = process.env.JWT_SECRET;

const verifyTokenAndCsrf = (req, res, next) => {
    const token = req.cookies.token;
    const csrfToken = req.headers["csrf-token"];

    if (!token) return res.status(401).json("NO TOKEN PROVIDED");
    if (!csrfProtection.verify(secret, csrfToken)) return res.status(403).json("INVALID CSRF TOKEN");

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        next();
    } catch (e) {
        return res.status(401).json("INVALID JWT TOKEN");
    }
};

module.exports = { verifyTokenAndCsrf };