# 🎬 THEATER SIGNAGE SYSTEM

映画館向けサイネージ集中管理システム - リアルタイム通信対応

## 📋 プロジェクト概要

このシステムは映画館のデジタルサイネージを効率的に管理するためのWebアプリケーションです。集中管理画面から各シアターのサイネージをリアルタイムで制御し、映画情報の表示・更新を行うことができます。

### 🎯 主な機能

- **映画データ管理**: 映画の登録、編集、削除
- **サイネージ集中管理**: 各シアターのサイネージを一元管理
- **リアルタイム更新**: Socket.IOによる即座の画面反映
- **カスタムタイトル**: 特別上映用のタイトルオーバーライド
- **上映種別設定**: 字幕、吹替、4K、3Dなどの表示設定
- **接続状態監視**: サイネージのオンライン/オフライン状態表示

## 🏗️ システム構成

```
THEATER_SIGNAGE/
├── frontend/          # React.js フロントエンド
├── backend/           # Node.js + Express バックエンド
├── testdata/          # テストデータ
└── README.md
```

### 技術スタック

#### フロントエンド

- **React.js 19.1.1** - UIライブラリ
- **Vite** - ビルドツール
- **Material-UI** - UIコンポーネント
- **SWR** - データフェッチング
- **Socket.IO Client** - リアルタイム通信
- **React Router** - ルーティング
- **CSS Modules** - スタイリング

#### バックエンド

- **Node.js** - サーバーサイドランタイム
- **Express.js 5.1.0** - Webフレームワーク
- **Socket.IO** - リアルタイム通信
- **MongoDB + Mongoose** - データベース
- **Firebase Admin** - 認証システム
- **JWT** - トークン認証

## 🚀 セットアップ手順

### 前提条件

- Node.js（v16以上）
- MongoDB
- Firebaseプロジェクト

### 1. リポジトリのクローン

```bash
git clone https://github.com/nas-onima/THEATER_SIGNAGE.git
cd THEATER_SIGNAGE
```

### 2. バックエンドセットアップ

```bash
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して以下を設定:
# - MONGODB_URI
# - FIREBASE_CONFIG
# - JWT_SECRET

# サーバー起動
npm start
```

### 3. フロントエンドセットアップ

```bash
cd frontend

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

### 4. Firebase セットアップ

1. Firebaseコンソールでプロジェクト作成
2. Authentication有効化
3. サービスアカウントキーをダウンロード
4. `backend/config/serviceAccountKey.json`に配置
5. `frontend/src/firebase.js`でFirebase設定

## 📡 Socket.IO 通信フロー

### リアルタイム更新シーケンス

```
管理画面での操作
    ↓
API経由でデータベース更新
    ↓
Socket.IO通知送信
    ↓
対象サイネージに即座反映
```

### 接続管理

- サイネージ接続時: `socketId`と`isConnected`をDBに記録
- 管理画面変更時: 対象サイネージのみに通知送信
- 切断時: 自動的に接続状態を`false`に更新

## 📁 プロジェクト構造詳細

### フロントエンド (`/frontend`)

```
src/
├── components/           # 再利用可能コンポーネント
│   ├── movie/           # 映画関連コンポーネント
│   ├── movieDetailsDialog/    # 映画詳細ダイアログ
│   ├── movieRegistrationForm/ # 映画登録フォーム
│   ├── movieSelectionList/    # 映画選択リスト
│   ├── schedulePanel/     # スケジュールパネル
│   ├── signageDetailsDialog/  # サイネージ設定ダイアログ
│   ├── signageListItem/   # サイネージリストアイテム
│   └── topbar/           # トップバー
├── hooks/               # カスタムフック
├── pages/               # ページコンポーネント
│   ├── home/            # ホーム画面
│   ├── loading/         # ローディング画面
│   ├── login/           # ログイン画面
│   ├── movieList/       # 映画一覧画面
│   ├── register/        # 登録画面
│   ├── schedules/       # スケジュール画面
│   ├── signage/         # サイネージ表示画面
│   └── signageManager/  # サイネージ管理画面
├── assets/              # 静的リソース
├── App.jsx              # メインアプリケーション
├── firebase.js          # Firebase設定
└── main.jsx            # エントリーポイント
```

### バックエンド (`/backend`)

```
├── config/              # 設定ファイル
│   ├── db.js           # MongoDB接続設定
│   ├── firebaseAdmin.js # Firebase Admin設定
│   └── serviceAccountKey.json # Firebase認証キー
├── models/              # データモデル
│   ├── Movie.js        # 映画モデル
│   ├── SignageStatus.js # サイネージステータスモデル
│   ├── TheaterSchedule.js # シアタースケジュールモデル
│   └── User.js         # ユーザーモデル
├── routes/              # APIルート
│   ├── auth.js         # 認証関連API
│   ├── middleware.js   # ミドルウェア
│   ├── movies.js       # 映画関連API
│   ├── schedules.js    # スケジュール関連API
│   ├── signage.js      # サイネージ関連API
│   └── users.js        # ユーザー関連API
└── server.js           # サーバーエントリーポイント
```

## 🔌 API エンドポイント

### 映画管理

- `GET /api/movies` - 映画一覧取得（ページネーション対応）
- `POST /api/movies` - 映画登録
- `GET /api/movies/:id` - 特定映画取得
- `PATCH /api/movies/:id` - 映画更新
- `DELETE /api/movies/:id` - 映画削除

### サイネージ管理

- `GET /api/signages` - サイネージ一覧取得
- `GET /api/signages/:id` - 特定サイネージ取得
- `PATCH /api/signages/:id` - サイネージ更新（Socket.IO通知付き）
- `DELETE /api/signages/:id` - サイネージ削除

### 認証

- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/verify` - トークン検証

## 🎨 画面構成

### 1. 映画管理画面 (`/movieList`)

- 映画の一覧表示・検索・フィルタリング
- 新規映画登録フォーム
- リスト表示・ポスター表示の切り替え

### 2. サイネージ管理画面 (`/signageManager`)

- 全サイネージの一覧表示
- 接続状態の可視化
- 各サイネージの設定変更

### 3. サイネージ表示画面 (`/signage/:id`)

- 映画ポスターの全画面表示
- 上映種別の表示
- タイトルオーバーライド対応
- リアルタイム更新機能

### 4. 認証画面

- Firebase認証によるログイン・登録
- セキュアなセッション管理

## 🔧 開発・運用

### 開発モード起動

```bash
# バックエンド
cd backend
npm run dev

# フロントエンド
cd frontend
npm run dev
```

### プロダクションビルド

```bash
# フロントエンド
cd frontend
npm run build

# ビルド結果確認
npm run preview
```

### 環境変数

#### バックエンド (`.env`)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/theater_signage
JWT_SECRET=your_jwt_secret_key
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
# その他Firebase設定...
```

#### フロントエンド (`firebase.js`)

```javascript
const firebaseConfig = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  projectId: "your_project_id",
  // その他Firebase設定...
};
```

## 📊 データベーススキーマ

### Movies Collection

```javascript
{
  title: String,           // 映画タイトル
  rating: String,          // レーティング (G, PG, R等)
  duration: Number,        // 上映時間（分）
  genre: String,           // ジャンル
  releaseDate: Date,       // 公開日
  endDate: Date,           // 上映終了日
  image: String,           // ポスター画像（Base64）
  description: String      // 説明
}
```

### SignageStatus Collection

```javascript
{
  theaterId: String,       // シアターID
  socketId: String,        // Socket.IO ID
  isConnected: Boolean,    // 接続状態
  movieId: String,         // 表示中映画ID
  titleOverride: String,   // カスタムタイトル
  description: String,     // 説明
  showingType: {           // 上映種別
    sub: Boolean,          // 字幕版
    dub: Boolean,          // 吹替版
    jsub: Boolean,         // 日本語字幕版
    fourK: Boolean,        // 4K上映
    threeD: Boolean,       // 3D上映
    cheer: Boolean,        // 応援上映
    live: Boolean,         // ライブビューイング
    greeting: Boolean,     // 舞台挨拶
    greetingLive: Boolean  // 舞台挨拶中継
  }
}
```

## 👨‍💻 開発者

- **nas-onima** - _Initial work_ - [GitHub](https://github.com/nas-onima)


**更新日**: 2025年10月4日  
**バージョン**: 1.0.0  
**Node.js**: v16以上推奨  
**MongoDB**: v4.4以上推奨
