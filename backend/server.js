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
const moviesRoute = require("./routes/movies");
const signageRoute = require("./routes/signage");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();

const app = express();
const server = http.createServer(app);

// 環境変数から設定を取得（デフォルトはローカル開発用）
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const io = socketIo(server);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//middleware
app.use(express.json());
app.use(cookieParser())

// 本番環境用フロントエンド統合設定
app.use(express.static(path.join(__dirname, 'dist')));

app.use("/api/users", usersRoute);
app.use("/api/movies", moviesRoute);
app.use("/api/auth", authRoute);
app.use("/api/signages", signageRoute);

app.get(/^(?!\/api).*/, (req, res) => {
  // この正規表現 /^(?!\/api).*/ は、
  // "/api" で始まらないすべてのリクエストパスに一致します。
  // そのため、静的ファイルにも一致しなかった /home や /about がここに到達します。

  // req.path.startsWith('/api') のチェックは不要になりますが、念のため残すことも可能

  return res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

//connect to DB and start server
connectDB();
const PORT = process.env.PORT || 5000;

// 各シアターの接続済みソケットを管理
const theaterConnections = new Map();

// Socket.IO接続処理
io.on('connection', (socket) => {
  console.log('クライアントが接続しました:', socket.id);

  // サイネージの接続処理
  socket.on('signage-connect', async (data) => {
    try {
      const { theaterId } = data;
      console.log(`シアター${theaterId}のサイネージが接続しました:`, socket.id);

      // 既存の接続があるかチェック
      const existingConnections = theaterConnections.get(theaterId) || [];

      // 新しい接続を追加
      const newConnections = [...existingConnections, socket.id];
      theaterConnections.set(theaterId, newConnections);

      // 既存の接続がある場合、それらに新しい接続の通知を送信
      if (existingConnections.length > 0) {
        existingConnections.forEach(existingSocketId => {
          const existingSocket = io.sockets.sockets.get(existingSocketId);
          if (existingSocket) {
            existingSocket.emit('new-connection-detected', {
              message: `同じシアター${theaterId}に新しい端末が接続されました`,
              theaterId,
              newSocketId: socket.id,
              totalConnections: newConnections.length
            });
          }
        });

        // 新しく接続した端末に既存接続の情報を送信
        socket.emit('existing-connections-detected', {
          message: `シアター${theaterId}には既に${existingConnections.length}台の端末が接続されています`,
          theaterId,
          existingConnections: existingConnections.length,
          totalConnections: newConnections.length
        });
      }

      // サイネージステータスを更新（最新の接続情報を保持）
      await SignageStatus.findOneAndUpdate(
        { theaterId },
        {
          socketIds: newConnections, // 複数のソケットIDを配列で保存
          isConnected: true,
          lastConnectedAt: new Date(),
          activeConnections: newConnections.length
        },
        { upsert: true, new: true }
      );

      // ソケットにシアターIDを保存
      socket.theaterId = theaterId;

      // 接続確認メッセージを送信
      socket.emit('connection-confirmed', {
        message: `シアター${theaterId}に接続しました`,
        theaterId,
        connectionNumber: newConnections.length,
        isMultipleConnection: newConnections.length > 1
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

        // 接続リストから該当ソケットを削除
        const existingConnections = theaterConnections.get(socket.theaterId) || [];
        const updatedConnections = existingConnections.filter(socketId => socketId !== socket.id);

        if (updatedConnections.length > 0) {
          // まだ他の接続がある場合
          theaterConnections.set(socket.theaterId, updatedConnections);

          // 残りの接続に通知
          updatedConnections.forEach(remainingSocketId => {
            const remainingSocket = io.sockets.sockets.get(remainingSocketId);
            if (remainingSocket) {
              remainingSocket.emit('connection-removed', {
                message: `シアター${socket.theaterId}の他の端末が切断されました`,
                theaterId: socket.theaterId,
                remainingConnections: updatedConnections.length
              });
            }
          });

          // サイネージステータスを更新（まだアクティブな接続がある）
          await SignageStatus.findOneAndUpdate(
            { theaterId: socket.theaterId },
            {
              socketIds: updatedConnections,
              isConnected: true,
              activeConnections: updatedConnections.length
            }
          );
        } else {
          // 最後の接続が切断された場合
          theaterConnections.delete(socket.theaterId);

          // サイネージステータスを更新（全て切断）
          await SignageStatus.findOneAndUpdate(
            { theaterId: socket.theaterId },
            {
              socketIds: [],
              isConnected: false,
              activeConnections: 0
            }
          );
        }
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

      if (signage && signage.socketIds && signage.socketIds.length > 0 && signage.isConnected) {
        // 全ての接続中のサイネージに更新通知を送信
        signage.socketIds.forEach(socketId => {
          const targetSocket = io.sockets.sockets.get(socketId);
          if (targetSocket) {
            targetSocket.emit('signage-data-updated', updateData);
          }
        });
        console.log(`シアター${theaterId}の${signage.socketIds.length}台の端末に更新通知を送信しました`);
      }
    } catch (error) {
      console.error('サイネージ更新通知エラー:', error);
    }
  });

  // 接続確認用のハートビート処理
  socket.on('signage-heartbeat', async (data) => {
    try {
      const { theaterId, timestamp } = data;

      // ハートビートの応答を送信
      socket.emit('heartbeat-response', {
        theaterId,
        serverTime: Date.now(),
        clientTime: timestamp
      });
    } catch (error) {
      console.error('ハートビート処理エラー:', error);
    }
  });
});

// Socket.IOインスタンスをグローバルに利用可能にする
app.set('socketio', io);

server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
  console.log('Socket.IO server is ready');
});