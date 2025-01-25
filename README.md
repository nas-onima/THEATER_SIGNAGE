# DB のデータ構造について

## User.js

| フィールド名 | 型     | 必須  | ユニーク | デフォルト値 | 説明                                          |
| ------------ | ------ | ----- | -------- | ------------ | --------------------------------------------- |
| \_id         | String | true  | true     | なし         | ユーザー ID                                   |
| name         | String | true  | false    | なし         | ユーザー名                                    |
| userId       | String | true  | true     | なし         | 一意のユーザー ID                             |
| authType     | String | false | false    | 'password'   | 認証タイプ（'password' または 'google'）      |
| password     | String | false | false    | なし         | ユーザーのパスワード（最小長 6 文字）         |
| googleID     | String | false | false    | なし         | Google 認証用の ID                            |
| role         | String | false | false    | 'staff'      | ユーザーの役割（'staff', 'admin', 'signage'） |
| createdAt    | Date   | true  | false    | なし         | 登録日時                                      |
| updatedAt    | Date   | true  | false    | なし         | 最終更新日時                                  |

## Movie.js

| フィールド名 | 型     | 必須  | ユニーク | デフォルト値 | 説明                                      |
| ------------ | ------ | ----- | -------- | ------------ | ----------------------------------------- |
| \_id         | String | true  | true     | なし         | 映画 ID                                   |
| title        | String | true  | false    | なし         | タイトル                                  |
| image        | Buffer | false | false    | なし         | ポスターポップアップ画像データ            |
| rating       | String | true  | false    | 'g'          | レーティング（'g', 'pg12', 'r15', 'r18'） |
| showingType  | Array  | false | false    | []           | 上映種別格納用                            |
| createdAt    | Date   | true  | false    | なし         | 登録日時                                  |
| updatedAt    | Date   | true  | false    | なし         | 最終更新日時                              |

## TheaterSchedule.js

| フィールド名        | 型     | 必須  | ユニーク | デフォルト値 | 説明                        |
| ------------------- | ------ | ----- | -------- | ------------ | --------------------------- |
| \_id                | String | true  | true     | なし         | スケジュールの ID           |
| theaterName         | String | true  | true     | なし         | 上映シアター番号（名称）    |
| schedules           | Array  | true  | false    | []           | 上映情報配列                |
| schedules.movieId   | String | true  | false    | なし         | 映画コレクションへの参照 ID |
| schedules.startTime | Date   | true  | false    | なし         | 上映開始時刻                |
| schedules.endTime   | Date   | true  | false    | なし         | 上映終了時刻                |
| schedules.remarks   | String | false | false    | なし         | 任意の備考                  |
| createdAt           | Date   | true  | false    | なし         | 登録日時                    |
| updatedAt           | Date   | true  | false    | なし         | 最終更新日時                |
