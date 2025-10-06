const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require('body-parser');
const SignageStatus = require('./models/SignageStatus');

const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const schedulesRoute = require("./routes/schedules");
const moviesRoute = require("./routes/movies");
const signageRoute = require("./routes/signage");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const server = http.createServer(app);

// 環境変数から設定を取得（デフォルトはローカル開発用）
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = socketIo(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: FRONTEND_URL,
}));

app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/schedules", schedulesRoute);
app.use("/api/auth", authRoute);
app.use("/api/signages", signageRoute);

//connect to DB and start server
connectDB();
const PORT = process.env.PORT || 5000;

// Socket.IO接続処理
io.on('connection', (socket) => {
  console.log('クライアントが接続しました:', socket.id);

  // サイネージの接続処理
  socket.on('signage-connect', async (data) => {
    try {
      const { theaterId } = data;
      console.log(`シアター${theaterId}のサイネージが接続しました:`, socket.id);

      // サイネージステータスを更新
      await SignageStatus.findOneAndUpdate(
        { theaterId },
        {
          socketId: socket.id,
          isConnected: true
        },
        { upsert: true, new: true }
      );

      // ソケットにシアターIDを保存
      socket.theaterId = theaterId;

      // 接続確認メッセージを送信
      socket.emit('connection-confirmed', {
        message: `シアター${theaterId}に接続しました`,
        theaterId
      });

    } catch (error) {
      console.error('サイネージ接続エラー:', error);
      socket.emit('connection-error', { message: 'サイネージ接続に失敗しました' });
    }
  });

  // サイネージの切断処理
  socket.on('disconnect', async () => {
    try {
      if (socket.theaterId) {
        console.log(`シアター${socket.theaterId}のサイネージが切断されました:`, socket.id);

        // サイネージステータスを更新
        await SignageStatus.findOneAndUpdate(
          { theaterId: socket.theaterId },
          {
            socketId: null,
            isConnected: false
          }
        );
      }
    } catch (error) {
      console.error('サイネージ切断処理エラー:', error);
    }
  });

  // 管理画面からのサイネージ更新通知
  socket.on('signage-update', async (data) => {
    try {
      const { theaterId, updateData } = data;

      // 対象のサイネージを取得
      const signage = await SignageStatus.findOne({ theaterId });

      if (signage && signage.socketId && signage.isConnected) {
        // 対象のサイネージにのみ更新通知を送信
        io.to(signage.socketId).emit('signage-data-updated', updateData);
        console.log(`シアター${theaterId}に更新通知を送信しました`);
      }
    } catch (error) {
      console.error('サイネージ更新通知エラー:', error);
    }
  });
});

// Socket.IOインスタンスをグローバルに利用可能にする
app.set('socketio', io);

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
  console.log('Socket.IO server is ready');
});