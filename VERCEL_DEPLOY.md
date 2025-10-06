# Theater Signage System - Vercel デプロイガイド

## 📋 デプロイ前の準備

### 1. MongoDB Atlas 設定

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)でクラスターを作成
2. データベースユーザーを作成
3. 接続文字列を取得 (例: `mongodb+srv://user:password@cluster.mongodb.net/THEATER-SIGNAGE`)

### 2. Vercel アカウント設定

1. [Vercel](https://vercel.com)に GitHub アカウントでログイン
2. プロジェクトを GitHub にプッシュ

## 🚀 デプロイ手順

### フロントエンド（Frontend）

1. Vercel ダッシュボードで新しいプロジェクトを作成
2. GitHub リポジトリを選択し、**frontend**フォルダを指定
3. 環境変数を設定:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.vercel.app
   VITE_SOCKET_URL=https://your-backend-domain.vercel.app
   ```
4. デプロイ実行

### バックエンド（Backend）

1. Vercel ダッシュボードで新しいプロジェクトを作成
2. GitHub リポジトリを選択し、**backend**フォルダを指定
3. 環境変数を設定:
   ```
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/THEATER-SIGNAGE
   JWT_SECRET=your-jwt-secret-key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   PORT=5000
   ```
4. デプロイ実行

## 🔧 環境変数一覧

### フロントエンド環境変数

| 変数名              | 説明                    | 例                           |
| ------------------- | ----------------------- | ---------------------------- |
| `VITE_API_BASE_URL` | バックエンド API の URL | `https://backend.vercel.app` |
| `VITE_SOCKET_URL`   | Socket.IO 接続 URL      | `https://backend.vercel.app` |

### バックエンド環境変数

| 変数名         | 説明               | 例                            |
| -------------- | ------------------ | ----------------------------- |
| `MONGODB_URI`  | MongoDB 接続文字列 | `mongodb+srv://...`           |
| `JWT_SECRET`   | JWT 署名用秘密鍵   | `your-secret-key`             |
| `FRONTEND_URL` | フロントエンド URL | `https://frontend.vercel.app` |
| `PORT`         | サーバーポート番号 | `5000`                        |

## ✅ デプロイ後の確認

1. **フロントエンド**: ブラウザでアクセスしてログイン画面が表示されることを確認
2. **バックエンド**: `https://your-backend.vercel.app/api/health` で API が稼働していることを確認
3. **認証**: Google ログインが正常に動作することを確認
4. **Socket.IO**: サイネージのリアルタイム更新が動作することを確認

## 🔄 ローカル開発

ローカル開発時は環境変数を設定しなくても、デフォルトで localhost が使用されます：

```bash
# フロントエンド
cd frontend
npm install
npm run dev  # http://localhost:5173

# バックエンド
cd backend
npm install
npm start    # http://localhost:5000
```

## 🛠️ トラブルシューティング

### CORS エラー

- `FRONTEND_URL`環境変数が正しく設定されているか確認
- フロントエンドとバックエンドのドメインが正しく設定されているか確認

### Socket.IO 接続エラー

- `VITE_SOCKET_URL`がバックエンドの URL と一致しているか確認
- ネットワーク設定で WebSocket が許可されているか確認

### API 接続エラー

- `VITE_API_BASE_URL`が正しく設定されているか確認
- バックエンドが正常に起動しているか確認

### MongoDB 接続エラー

- `MONGODB_URI`が正しい形式で設定されているか確認
- MongoDB Atlas でネットワークアクセス設定が正しいか確認
