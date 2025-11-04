# demo アプリケーション
検証内容
- ReactとLaravelを繋ぎこむ
- Atomic designでコンポーネント化

## プロジェクト構造

```
todo-app-demo/
├── frontend/                   # React TypeScript アプリケーション
│   ├── public/                 # 静的ファイル
│   ├── src/                    # ソースコード
│   │   ├── components/         # UIコンポーネント
│   │   │   ├── atoms/          # 最小単位のコンポーネント
│   │   │   ├── molecules/      # 複数のatomsで構成されるコンポーネント
│   │   │   ├── organisms/      # 複数のmoleculesで構成されるコンポーネント
│   │   │   └── pages/          # ページコンポーネント
│   │   ├── contexts/           # Reactコンテキスト
│   │   ├── hooks/              # カスタムフック
│   │   ├── services/           # APIサービス
│   │   ├── types/              # 型定義
│   │   ├── utils/              # ユーティリティ関数
│   │   ├── App.tsx             # アプリケーションのルートコンポーネント
│   │   └── main.tsx            # エントリーポイント
│   ├── package.json            # フロントエンド依存関係
│   └── tsconfig.json           # TypeScript設定
│
└── backend/                    # Laravel API
    ├── app/                    # アプリケーションコア
    │   ├── Http/               # HTTPレイヤー
    │   │   └── Controllers/    # APIコントローラー（TodoController）
    │   ├── Models/             # データモデル（Todo, User）
    │   └── Providers/          # サービスプロバイダー
    ├── database/               # マイグレーションとシーダー
    ├── routes/                 # APIルート
    ├── tests/                  # テストファイル
    └── composer.json           # バックエンド依存関係
```

## セットアップ手順

### フロントエンド
```bash
cd frontend
npm install
npm run dev
```

### バックエンド
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

- テスト用ログイン情報
  - メールアドレス: `test@example.com`
  - パスワード: `password`

## 開発環境

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:8000

## 使用技術

### フロントエンド
- React
- TypeScript
- Vite (ビルドツール)
- Atomicデザインパターン（コンポーネント設計）

### バックエンド
- Laravel
- MySQL
- RESTful API

## 機能

- ToDoアイテムの表示
- 新規ToDoの追加
- ToDoの完了状態の切り替え
- ToDoの削除

## API エンドポイント

- `GET /api/todos` - 全てのToDoを取得
- `POST /api/todos` - 新しいToDoを作成
- `PUT /api/todos/{id}` - 指定したToDoを更新
- `DELETE /api/todos/{id}` - 指定したToDoを削除
