# モノ特定・根拠検索AI (Mono Finder AI)

インターネット上の信頼できる公式情報源・一次資料を根拠に、自然言語から工業部品・車両部品・電子機器・家電などの特定と適合性照合を行うWebアプリケーションです。

---

## 💡 特徴・設計思想
- **「推測」ではなく「根拠」で答える**:
  AI自身の知識だけで型式や適合性を断定せず、**「対象特定 → 根拠検索 → 根拠評価 → 回答生成」**の厳密なパイプラインを実行。
- **情報源の透明性**:
  すべての回答に可能な限りメーカー公式Webページ、公式PDF図面、純正パーツリストなどの根拠URLと信頼度区分（メーカー公式、公式PDF、正規代理店等）を付与。
- **車・バイク部品の安全重視**:
  年式・型式・仕向地などの情報が不足している場合は、推測で回答せず「追加質問」としてユーザーに確認。
- **Security-First アーキテクチャ**:
  - APIキー・秘密情報はフロントエンドに一切持たせず、すべて Cloud Functions 側で Secret Manager 管理。
  - Firebase App Check による不正呼出し防止。
  - 入力値の二重検証（Zod による 2〜300文字制限）。
  - SSRF対策（任意URLの直接取得禁止）。
  - 検索履歴や車台番号等の個人識別情報の恒久保存ゼロ。

---

## 📁 ディレクトリ構成

```
mono-finder-ai/
├── README.md              # プロジェクト説明書（本書）
├── firebase.json          # Firebase Hosting / Functions / Emulators 設定
├── .firebaserc            # Firebase プロジェクト設定
├── docs/
│   ├── SPEC.md            # 詳細仕様書
│   ├── ARCHITECTURE.md    # アーキテクチャ設計書
│   └── SECURITY.md        # セキュリティ基本方針・ガイドライン
├── frontend/              # React + Vite + TypeScript フロントエンド
│   ├── src/
│   │   ├── components/    # UIコンポーネント (ResultCard, SearchInput 等)
│   │   ├── services/      # API層 (Mockモード / Firebase Callable 切り替え)
│   │   ├── types/         # 型定義
│   │   └── App.tsx        # チャットUI制御
└── functions/             # Firebase Cloud Functions (2nd gen, TypeScript)
    └── src/
        ├── index.ts       # Callable Function: searchObject
        ├── validators.ts  # Zod 入力バリデーション
        ├── mockService.ts # バックエンド側モックロジック
        └── types.ts       # リクエスト/レスポンス型
```

---

## 🚀 クイックスタート (ローカル開発)

### 1. 前提条件
- Node.js v20 以上 (v24 確認済)
- npm v10 以上

### 2. セットアップ

```bash
# プロジェクトルートに移動
cd mono-finder-ai

# フロントエンドの依存関係インストール
cd frontend
npm install

# Functions の依存関係インストール
cd ../functions
npm install
```

### 3. フロントエンドの起動 (Mockモード)
初期状態ではバックエンドや Firebase の設定がなくても、ローカルの豊富なモックデータを使って UI や検索体験を即座に確認できます。

```bash
cd frontend
npm run dev
```

ブラウザで `http://localhost:5173` を開いて動作を確認してください。

#### モック検索の入力例:
- `2014年式CB1100のオイルフィルター` (バイク部品 / 純正品番特定・公式根拠)
- `BMアクセラ2.0 6MTのブレーキパッド` (車部品 / 適合・純正品番特定)
- `外径47 内径20 幅14の深溝玉軸受` (産業部品 / 規格一致・寸法照合)
- `オムロン E2E-X10MF1 の後継機種` (FA部品 / メーカー後継品情報)
- `ハイエースのタイヤ` (情報不足パターン / 追加質問の自動発生テスト)

---

## 🛡️ セキュリティ上の注意点
- **APIキーの取り扱い**: `.env` やコード内に直接 API キーをコミットしないでください。
- **App Check**: 本番デプロイ時は Firebase コンソールで reCAPTCHA v3 / Enterprise のキーを登録し、`enforceAppCheck: true` で保護します。
- **詳細は必ず [docs/SECURITY.md](docs/SECURITY.md) を参照してください。**
