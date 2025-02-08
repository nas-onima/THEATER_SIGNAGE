const router = require("express").Router();
const Movie = require("../models/Movie");
const TheaterSchedule = require("../models/TheaterSchedule");
const { verifyToken } = require("./middleware");

// シアター新規登録
router.post("/register", verifyToken, async (req, res) => {
    try {
        const newSchedule = await new TheaterSchedule({
            theaterName: req.body.theaterName,
            schedule: req.body.schedule,
        });

        const schedule = await newSchedule.save();
        return res.status(200).json(schedule);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// 複数件のシアターのスケジュールデータ取得（ページネーション対応）
router.get("/", verifyToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1");
        const limit = parseInt(req.query.limit || "10");
        const skip = (page - 1) * limit;

        const schedules = await TheaterSchedule.find().limit(limit).skip(skip).sort({ theaterName: 1 });
        const totalSchedules = await TheaterSchedule.countDocuments();

        return res.status(200).json({
            total: totalSchedules,
            page: page,
            pageSize: limit,
            schedules: schedules
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});

// 特定のシアターのスケジュールデータ取得
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const schedule = await TheaterSchedule.findById(req.params.id);
        if (!Movie) return res.status(404).json("SCHEDULE NOT FOUND");
        return res.status(200).json(schedule);
    } catch (error) {
        return res.status(500).json(error);
    }
});


// 特定のシアターのスケジュールデータ更新（スケジュールの更新はこっちを常用）
router.patch("/:id", verifyToken, async (req, res) => {
    try {
        const schedule = await TheaterSchedule.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!schedule) return res.status(404).json("TARGET SCHEDULE NOT FOUND");
        return res.status(200).json(schedule);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// 特定のシアターデータ削除
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const schedule = await TheaterSchedule.findByIdAndDelete(req.params.id);
        if (!schedule) return res.status(404).json("TARGET SCHEDULE NOT FOUND");
        return res.status(200).json("SCHEDULE DELETED");
    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;