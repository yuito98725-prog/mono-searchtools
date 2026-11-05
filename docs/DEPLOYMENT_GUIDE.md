# 本番公開・GitHub 連携ガイド (docs/DEPLOYMENT_GUIDE.md)

本ドキュメントでは、本プロジェクト（型式、物品検索AI）を GitHub で管理し、Firebase へ安全に公開（デプロイ）するまでの全手順をわかりやすく解説します。

---

## 🛡️ セキュリティの前提（漏洩防止の仕組み）
- 本プロジェクトの [`.gitignore`](../.gitignore) により、**API キーや秘密情報を含むファイル（`.env`, `.env.local`）は GitHub へ絶対にコミットされません**。
- GitHub 上にはソースコードのみが保存され、公開環境でも API キーが世界に露出することはありません。

---

## ステップ 1: GitHub にリポジトリを作成する

1. ブラウザで [GitHub](https://github.com/) にログインします。
2. 画面右上の「**+**」アイコンから「**New repository**」をクリックします。
3. 設定項目を入力します：
   - **Repository name**: 例 `mono-finder-ai`（お好きな名前で構いません）
   - **Public / Private**: どちらでも構いません（安全設計のため Public でも秘密情報は漏洩しませんが、まずは Private 推奨）。
   - 「Add a README file」や「.gitignore」のチェックは**すべて外した状態（空のリポジトリ）**にします。
4. 「**Create repository**」ボタンを押します。
5. 作成後に表示されるリポジトリの URL（例: `https://github.com/ユーザー名/mono-finder-ai.git`）を控えておきます。

---

## ステップ 2: ローカルから GitHub へプッシュする

パソコンのターミナル（またはお使いの Git ツール）で以下のコマンドを実行します：

```bash
# プロジェクトフォルダへ移動
cd C:\Users\yuito\.gemini\antigravity\scratch\mono-finder-ai

# Git を初期化
git init

# 全ファイルをステージング (gitignore で秘密情報は自動除外されます)
git add .

# 初回コミットを作成
git commit -m "feat: 初期構築 (型式・物品検索AI Phase 1-5)"

# メインブランチを main に設定
git branch -M main

# リモートリポジトリ（GitHub）の URL を設定 (ご自身のリポジトリURLに置き換えてください)
git remote add origin https://github.com/あなたのユーザー名/mono-finder-ai.git

# GitHub へプッシュ
git push -u origin main
```

---

## ステップ 3: Firebase プロジェクトの作成（無料枠で開始可能）

1. [Firebase Console](https://console.firebase.google.com/) にアクセスし、Google アカウントでログインします。
2. 「**プロジェクトを追加**」をクリックし、プロジェクト名（例: `mono-finder-ai-prod`）を入力します。
3. Google アナリティクスは必要に応じて有効化し、プロジェクトを作成します。
4. 左メニュー「**プロジェクトの概要 (歯車アイコン)**」＞「**プロジェクトの設定**」を開きます。
5. 「マイアプリ」の「**</> (ウェブ)**」をクリックして Web アプリを登録します。
6. 表示された Firebase 設定値（`apiKey`, `projectId` など）を控えます。

---

## ステップ 4: Gemini API キーの準備

1. [Google AI Studio (API Keys)](https://aistudio.google.com/app/apikey) にアクセスします。
2. 「**Create API key**」をクリックして、新しい Gemini API キーを生成・コピーします。
3. **ローカルで本物の検索を試す場合**:
   `functions/.env.local` というファイルを新規作成し、以下を記述して保存するだけですぐに有効化されます：
   ```env
   GEMINI_API_KEY=ここにコピーしたAPIキーを貼り付け
   ```

---

## ステップ 5: GitHub Actions での自動デプロイ設定（CI/CD）

GitHub リポジトリの **Settings ＞ Secrets and variables ＞ Actions** を開き、「**New repository secret**」から以下のシークレットを登録します：

| シークレット名 | 設定内容 |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | Firebase の apiKey |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase の authDomain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase の projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase の storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase の messagingSenderId |
| `VITE_FIREBASE_APP_ID` | Firebase の appId |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase サービスアカウントの JSON キー |

これで、今後 GitHub にコードを `git push` するだけで、自動的にビルドと本番デプロイが完了するようになります！
