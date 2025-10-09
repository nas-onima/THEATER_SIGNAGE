const router = require("express").Router();
const Movie = require("../models/Movie");
const SignageStatus = require("../models/SignageStatus");
const { verifyToken } = require("./middleware");

// サイネージ新規登録
router.post("/register", verifyToken, async (req, res) => {
    try {
        const newSignage = await new SignageStatus();

        const signage = await newSignage.save();
        return res.status(200).json(signage);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// 複数件のサイネージの表示中データ取得（ページネーション対応）
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page || "1");
        const limit = parseInt(req.query.limit || "10");
        const skip = (page - 1) * limit;

        const signages = await SignageStatus.find().limit(limit).skip(skip).sort({ theaterId: 1 });
        const totalSignages = await SignageStatus.countDocuments();

        // movieIdをまとめて取得
        const movieIds = signages.map(s => s.movieId).filter(id => !!id);
        const movies = await Movie.find({ _id: { $in: movieIds } });
        // id:movieのMapを作成
        const movieMap = {};
        movies.forEach(m => { movieMap[m._id] = m; });

        // signagesにmovie情報を付与
        const signagesWithMovie = signages.map(s => {
            const signageObj = s.toObject();
            signageObj.movie = signageObj.movieId ? movieMap[signageObj.movieId] || null : null;
            return signageObj;
        });

        return res.status(200).json({
            total: totalSignages,
            page: page,
            pageSize: limit,
            signages: signagesWithMovie
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});

// 特定のサイネージの表示中データ取得
router.get("/:id", async (req, res) => {
    try {
        const signage = await SignageStatus.findById(req.params.id);
        if (!signage) return res.status(404).json("SIGNAGE NOT FOUND(id:" + req.params.id + ")");

        // movie情報を付与
        const signageObj = signage.toObject();
        if (signageObj.movieId) {
            const movie = await Movie.findById(signageObj.movieId);
            signageObj.movie = movie;
        } else {
            signageObj.movie = null;
        }

        return res.status(200).json(signageObj);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// 特定サイネージの表示データ更新（サイネージ更新はこっちを常用）
router.patch("/:id", async (req, res) => {
    try {
        const signage = await SignageStatus.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!signage) return res.status(404).json("TARGET SIGNAGE NOT FOUND");

        // Socket.IO通知を送信
        const io = req.app.get('socketio');
        if (io && signage.socketIds && signage.socketIds.length > 0 && signage.isConnected) {
            // 更新されたサイネージデータを取得（movie情報付き）
            const signageObj = signage.toObject();
            if (signageObj.movieId) {
                const Movie = require("../models/Movie");
                const movie = await Movie.findById(signageObj.movieId);
                signageObj.movie = movie;
            } else {
                signageObj.movie = null;
            }

            // 全ての接続中のサイネージに更新通知を送信
            signage.socketIds.forEach(socketId => {
                const targetSocket = io.sockets.sockets.get(socketId);
                if (targetSocket) {
                    targetSocket.emit('signage-data-updated', signageObj);
                }
            });
            console.log(`シアター${signage.theaterId}の${signage.socketIds.length}台の端末に更新通知を送信しました`);
        }

        return res.status(200).json(signage);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// 特定のサイネージ削除
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const signage = await SignageStatus.findByIdAndDelete(req.params.id);
        if (!signage) return res.status(404).json("TARGET SIGNAGE NOT FOUND");
        return res.status(200).json("SIGNAGE DELETED");
    } catch (error) {
        return res.status(500).json(error);
    }
});

module.exports = router;