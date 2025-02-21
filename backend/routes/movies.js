const router = require("express").Router();
const { now } = require("mongoose");
const Movie = require("../models/Movie");
const { verifyToken } = require("./middleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 映画データの登録
router.post("/register", verifyToken, async (req, res) => {
    try {
        let movieData = { ...req.body }; // リクエストデータをコピー
        let unsetFields = {};

        // `null` が指定されたフィールドを削除対象にする
        Object.keys(movieData).forEach(key => {
            if (movieData[key] === null) {
                unsetFields[key] = "";
                delete movieData[key]; // 通常の登録データからも除外
            }
        });

        // 映画データを作成
        const newMovie = new Movie({
            title: movieData.title,
            image: movieData.image || "",
            rating: movieData.rating,
            showingType: movieData.showingType || [],
            releaseDate: movieData.releaseDate,
            endDate: movieData.endDate,
        });

        // 登録
        const savedMovie = await newMovie.save();

        // `null` 指定のフィールドを削除（もしあれば）
        if (Object.keys(unsetFields).length > 0) {
            await Movie.updateOne(
                { _id: savedMovie._id },
                { $unset: unsetFields }
            );
        }

        return res.status(200).json(savedMovie);
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
});

// 複数件の映画データ取得（ページネーション対応）
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1");
        const limit = parseInt(req.query.limit || "10");
        const skip = (page - 1) * limit;
        const qsortby = req.query.sortby;
        const sortby = qsortby === "releaseDate-1" ? { releaseDate: -1 } : qsortby === "releaseDate" ? { releaseDate: 1 } : qsortby === "title-1" ? { title: -1 } : { title: 1 };
        const notEnded = parseInt(req.query.notended);
        const searchQuery = req.query.search || "";

        let query = {};

        if (notEnded) {
            const now = new Date(); // 現在の日時を取得
            query = {
                $and: [
                    {
                        $or: [
                            { endDate: { $gte: now } },
                            { endDate: { $exists: false } }
                        ]
                    },
                    { title: { $regex: searchQuery, $options: "i" } }
                ]
            };
        } else {
            query = { title: { $regex: searchQuery, $options: "i" } };
        }

        const movies = await Movie.find(query)
            .limit(limit)
            .skip(skip)
            .sort(sortby);

        const totalMovies = await Movie.countDocuments(query);

        return res.status(200).json({
            total: totalMovies,
            page: page,
            pageSize: limit,
            movies: movies
        });
    } catch (e) {
        return res.status(500).json(e);
    }
});

// 指定された映画データの取得
router.get("/movie/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json("MOVIE NOT FOUND");
        return res.status(200).json(movie);
    } catch (e) {
        return res.status(500).json(e);
    }
});

// 指定された映画データの変更
router.patch("/movie/:id", verifyToken, async (req, res) => {
    try {
        const updateData = { ...req.body }; // リクエストデータをコピー
        const unsetFields = {};

        // 特定のキーが null の場合、そのフィールドを削除する
        Object.keys(req.body).forEach(key => {
            if (req.body[key] === null) {
                unsetFields[key] = "";
                delete updateData[key]; // 通常の更新データから除外
            }
        });

        // 更新クエリを作成
        const updateQuery = {
            $set: updateData,      // 通常の更新データ
            ...(Object.keys(unsetFields).length > 0 && { $unset: unsetFields }) // 削除するフィールド
        };

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            updateQuery,
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
router.delete("/movie/:id", verifyToken, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) res.status(404).json("TARGET MOVIE NOT FOUND");
        return res.status(200).json("MOVIE DELETED");
    } catch (e) {
        return res.status(500).json(e);
    }
});

module.exports = router;