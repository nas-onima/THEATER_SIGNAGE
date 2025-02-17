const router = require("express").Router();
const Movie = require("../models/Movie");
const { verifyToken } = require("./middleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 映画データの登録
router.post("/register", verifyToken, async (req, res) => {
    try {
        const newMovie = await new Movie({
            title: req.body.title,
            image: req.body.image || "",
            rating: req.body.rating || "g",
            showingType: req.body.showingType || [],
            releaseDate: req.body.releaseDate,
        });

        const user = await newMovie.save();
        return res.status(200).json(user);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
})

// 複数件の映画データ取得（ページネーション対応）
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1");
        const limit = parseInt(req.query.limit || "10");
        const skip = (page - 1) * limit;

        const movies = await Movie.find().limit(limit).skip(skip).sort({ updatedAt: -1 });
        const totalMovies = await Movie.countDocuments();

        return res.status(200).json({
            total: totalMovies,
            page: page,
            pageSize: limit,
            movies: movies
        });
    } catch (e) {
        return res.status(500).json(e);
    }
})

// 指定された映画データ取得
router.get("/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json("MOVIE NOT FOUND");
        return res.status(200).json(movie);
    } catch (e) {
        return res.status(500).json(e);
    }
});

// 指定された映画データの変更
router.patch("/:id", verifyToken, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!movie) return res.status(404).json("TARGET MOVIE NOT FOUND");
        return res.status(200).json(movie);
    } catch (e) {
        return res.status(500).json(e);
    }
});

// 指定された映画データの削除
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) res.status(404).json("TARGET MOVIE NOT FOUND");
        return res.status(200).json("MOVIE DELETED");
    } catch (e) {
        return res.status(500).json(e);
    }
});


module.exports = router;