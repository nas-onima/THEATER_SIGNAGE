const router = require("express").Router();
const User = require("../models/User");
const { verifyToken } = require("./middleware");

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json("TARGET USER NOT FOUND");
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json(e);
    }
});

router.patch("/:id", verifyToken, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id).select("userId");
        if (!targetUser) return res.status(404).json("TARGET USER NOT FOUND");
        const operatingUserId = req.userId;
        const operatingUser = await User.findOne({ userId: operatingUserId }).select("role");
        if (operatingUserId === targetUser.userId || operatingUser.role === "admin") {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );
            return res.status(200).json(user);
        }
        return res.status(403).json("YOU DON'T HAVE PERMISSION TO CHANGE OTHER USER'S DATA");
    } catch (e) {
        return res.status(500).json(e);
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id).select("userId");
        if (!targetUser) return res.status(404).json("TARGET USER NOT FOUND");
        const operatingUserId = req.userId;
        const operatingUser = await User.findOne({ userId: operatingUserId }).select("role");
        if (operatingUserId === targetUser.userId || operatingUser.role === "admin") {
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("USER DELETED");
        }
        return res.status(403).json("YOU DON'T HAVE PERMISSION TO DELETE OTHER USER'S DATA");
    } catch (e) {
        return res.status(500).json(e);
    }
})

module.exports = router;