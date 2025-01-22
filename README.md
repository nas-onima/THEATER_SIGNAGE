# DBのデータ構造について
## User.js

| フィールド名 | 型     | 必須  | ユニーク | デフォルト値 | 説明                           |
|--------------|--------|-------|----------|--------------|--------------------------------|
| _id          | String | true  | true     | なし         | ユーザーID                     |
| name         | String | true  | false    | なし         | ユーザー名                     |
| userId       | String | true  | true     | なし         | 一意のユーザーID               |
| authType     | String | false | false    | 'password'   | 認証タイプ（'password' または 'google'） |
| password     | String | false | false    | なし         | ユーザーのパスワード（最小長6文字） |
| googleID     | String | false | false    | なし         | Google認証用のID               |
| role         | String | false | false    | 'staff'      | ユーザーの役割（'staff', 'admin', 'signage'） |
| createdAt    | Date   | true  | false    | なし         | 登録日時                       |
| updatedAt    | Date   | true  | false    | なし         | 最終更新日時                     |

## Movie.js

| フィールド名 | 型     | 必須  | ユニーク | デフォルト値 | 説明                           |
|--------------|--------|-------|----------|--------------|--------------------------------|
| _id          | String | true  | true     | なし         | 映画ID                          |
| title        | String | true  | false    | なし         | タイトル                        |
| image        | Buffer | false | false    | なし         | ポスターポップアップ画像データ |
| rating       | String | true  | false    | 'g'          | レーティング（'g', 'pg12', 'r15', 'r18'） |
| showingType     | Array  | false | false    | []            | 上映種別格納用                        |
| createdAt    | Date   | true  | false    | なし         | 登録日時                       |
| updatedAt    | Date   | true  | false    | なし         | 最終更新日時                     |

## TheaterSchedule.js

| フィールド名 | 型     | 必須  | ユニーク | デフォルト値 | 説明                           |
|--------------|--------|-------|----------|--------------|--------------------------------|
| _id          | String | true  | true     | なし         | シアター番号（スケジュールのID） |
| schedules    | Array  | true  | false    | []            | 上映情報配列                      |
| schedules.movieId | String | true  | false    | なし         | 映画コレクションへの参照ID |
| schedules.startTime | Date   | true  | false    | なし         | 上映開始時刻                     |
| schedules.endTime | Date   | true  | false    | なし         | 上映終了時刻                     |
| schedules.remarks | String | false | false    | なし         | 任意の備考                     |
| createdAt    | Date   | true  | false    | なし         | 登録日時                       |
| updatedAt    | Date   | true  | false    | なし         | 最終更新日時                     |