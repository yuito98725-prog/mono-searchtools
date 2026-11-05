# セキュリティ基本方針と設計基準 (docs/SECURITY.md)

## 【最重要不変ルール】
> **本セキュリティ方針は、機能追加・開発の利便性・納期の都合で勝手に緩和・無効化してはならない。**  
> 安全性と利便性が衝突した場合は、常に**安全側を最優先**とし、必要であればユーザーに安全な選択肢を提示すること。

---

## 1. 秘密情報・APIキーの完全秘匿
1. **ブラウザ露出の絶対禁止**
   - AI API キー（Gemini API等）、Search API キー、Google Cloud サービスアカウント秘密鍵は、フロントエンドコード（JavaScript, HTML, CSS, `VITE_*` 環境変数）に一切含めてはならない。
   - `vite.config.ts` の `define` や環境変数置換で秘密情報がクライアントバンドルに混入しないよう静的検証を行う。
2. **サーバー側での管理**
   - 本番環境: **Google Cloud Secret Manager** または Firebase Functions の秘密環境変数 (`defineSecret`) を用いる。
   - ローカル開発時: `functions/.env.local` を使用し、必ず `.gitignore` の対象としてコミットを防ぐ。
   - サンプル設定用として値を含まない `.env.example` のみをリポジトリに配置する。

---

## 2. Firebase App Check による防御
1. **未認可アクセスの遮断**
   - 本番環境の Callable Function は `enforceAppCheck: true` を基本原則とする。
   - Web アプリの App Check プロバイダとして **reCAPTCHA v3 / reCAPTCHA Enterprise** を導入する。
2. **開発環境のテスト手法**
   - 開発時に本番の App Check を無効化してはならない。
   - ローカル開発・CI 環境では **Firebase App Check Debug Provider** およびデバッグトークン（Debug Token）を用いて正規にトークンを検証する。

---

## 3. SSRF (Server-Side Request Forgery) 対策
1. **任意URLフェッチの禁止**
   - 初期仕様では、**ユーザーが入力した任意のURLをサーバー（Cloud Functions）が直接取得（fetch/curl）する機能は一切実装しない**。
   - 情報収集は、信頼できる公式Web検索API（Google Custom Search API等）を経由して取得したメタデータ・スニペットのみを用いる。
2. **将来の拡張における必須防御策**
   - 将来的に本文スクレイピングやPDF取得機能を導入する場合は、以下の防御を必須とする：
     - ホワイトリスト化されたメーカー公式ドメインのみ許可
     - スキームを `https://` に限定
     - プライベートIP（`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`）のブロック
     - クラウドメタデータエンドポイント（`169.254.169.254`, `metadata.google.internal`）の完全遮断
     - リダイレクト回数制限（最大3回まで・追従先も同等チェック）
     - レスポンスサイズ上限設定（例: 最大 5MB）
     - 接続タイムアウト（5秒以内）

---

## 4. 入力検証・サニタイズ
1. **二重検証の徹底**
   - フロントエンド（UX向上目的）とバックエンド（セキュリティ目的）の双方で同一条件のバリデーションを実施する。
2. **Functions 側バリデーション基準 (Zod スキーマ)**
   - 型: `string`
   - 最小文字数: 2文字（トリム後）
   - 最大文字数: 300文字（長文によるLLMトークン消費・バッファ消費攻撃の防止）
   - 制御文字・NULLバイトの排除
3. **プロンプトインジェクション対策**
   - ユーザー入力文は LLM プロンプト内にシステム指示と明確に区切られたデータブロック（Delimiterや構造化JSON形式）として安全に埋め込み、「ユーザー入力によってシステムルールや出力形式が上書きされない」堅牢なプロンプト設計を行う。

---

## 5. データ保存と個人情報保護の原則
1. **初期版におけるFirestore・DB不使用**
   - 原則として、検索履歴・クエリ・結果データをデータベースへ恒久保存しない。
2. **車台番号・個人識別情報の取扱**
   - 車両部品特定のため車台番号や型式指定番号が入力された場合でも、検索完了後にメモリ上から即時破棄し、永続化しない。
   - 氏名、メールアドレス、電話番号、会社名、IPアドレス等の不要な個人・組織識別情報を収集・保存しない。
3. **将来の履歴機能追加時の要件**
   - ユーザーによる明示的なオプトイン、暗号化保存、ユーザー自身によるワンクリック削除機能、厳格な Firebase Security Rules の策定を必須条件とする。

---

## 6. 会社・業務内情報の完全分離
- 本システムは個人開発の**完全公開Webアプリ**として運用する。
- 以下の内部リソースにはいかなる形態であっても接続・連携しない：
  - 会社の Microsoft 365, SharePoint, OneDrive, Teams
  - 会社の業務メール, 社内チャット
  - 社内共有サーバー, 社内Excel・部品管理台帳, 社内購入履歴
  - 社内ネットワーク (VPN), イントラネット専用URL
- すべての検索・判定処理は、インターネット上の**公知の公開情報のみ**を対象とする。

---

## 7. コスト暴走・DoS攻撃防御
1. **Cloud Functions 実行インスタンス制御**
   - `maxInstances`: **3** （初期値）
   - 同時アクセスが急増しても最大3インスタンスまでに物理制限し、想定外の課金スパイクを防止。
2. **リソース制限**
   - `timeoutSeconds`: 60秒
   - `memory`: 512MiB
3. **予算アラートと課金上限**
   - Google Cloud / Firebase コンソールにて「予算アラート」（例: 月額1,000円、3,000円、5,000円到達時）を設定する。
4. **将来的なレート制限 (Rate Limiting)**
   - Cloud Armor または Cloud Functions 側でトークンバケット/IPベースの短時間アクセス制限の追加を検討する。

---

## 8. エラーハンドリングと情報漏洩防止
- Cloud Functions で内部例外や外部API通信エラーが発生した場合、ブラウザに以下の情報を**一切返却してはならない**：
  - APIキー、トークン、パスワード
  - 内部ファイルパス（OSディレクトリ構造）
  - スタックトレース
  - 内部エンドポイントURL・IPアドレス
  - 外部APIのエラーレスポンス原文
- クライアントには常にサニタイズされた定型エラーコードと利用者にわかりやすい安全なメッセージのみを返す。

---

## 9. HTTPセキュリティヘッダー設計 (Firebase Hosting)
Firebase Hosting の設定 (`firebase.json`) により、全レスポンスに以下のセキュリティヘッダーを付与する：

```json
[
  { "key": "X-Content-Type-Options", "value": "nosniff" },
  { "key": "X-Frame-Options", "value": "DENY" },
  { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
  { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=()" },
  { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" },
  {
    "key": "Content-Security-Policy",
    "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.cloudfunctions.net https://*.firebaseapp.com; font-src 'self' data:; frame-ancestors 'none';"
  }
]
```

---

## 10. チェックリスト（フェーズ完了時必須確認）
- [ ] 外部APIキーがフロントエンドソースやgit履歴に存在しないこと
- [ ] Functions入力値がZodで正しく型・長さ・エスケープ検証されていること
- [ ] Functionsの `maxInstances` が3以下に設定されていること
- [ ] App Checkが適切に設定・検証されていること
- [ ] ユーザー入力URLの直接フェッチが存在しないこと
- [ ] 個人情報・車台番号がデータベースに保存されていないこと
- [ ] エラー時にスタックトレースが隠蔽されていること
- [ ] `npm audit` による脆弱性チェックがパスしていること
