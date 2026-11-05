import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { searchObjectInputSchema } from './validators';
import { getMockSearchResponse } from './mockService';
import { executeGeminiSearch } from './geminiService';
import { SearchObjectResponse } from './types';

// リージョンおよびリソース制限のグローバル設定
// 東京リージョン (asia-northeast1), maxInstances: 3 (コスト・DoS対策初期値)
setGlobalOptions({
  region: 'asia-northeast1',
  maxInstances: 3,
  timeoutSeconds: 60,
  memory: '512MiB'
});

/**
 * 型式、物品検索AI Callable Function
 * 
 * セキュリティ方針:
 * - 本番環境では enforceAppCheck: true を原則とする。
 * - ユーザー入力を Zod で厳密検証（2〜300文字、型、制御文字排除）。
 * - 内部例外時でも API キーや内部スタックトレースをブラウザに漏洩させない。
 * - GEMINI_API_KEY が設定されていれば Google Search Grounding でリアルタイム検索。
 * - 未設定時は安全なローカルモック応答にフォールバック。
 */
export const searchObject = onCall<any, Promise<SearchObjectResponse>>(
  {
    // 本番環境時は App Check を強制。開発環境(エミュレータ)では柔軟にデバッグ可能。
    enforceAppCheck: process.env.NODE_ENV === 'production'
  },
  async (request) => {
    // 1. App Check 検証ログ (本番時)
    if (!request.app && process.env.NODE_ENV === 'production') {
      throw new HttpsError(
        'failed-precondition',
        'App Check トークンが無効または存在しません。正規のクライアントからご利用ください。'
      );
    }

    // 2. 入力バリデーション (Zod)
    const parseResult = searchObjectInputSchema.safeParse(request.data);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || '入力データが不正です。';
      throw new HttpsError('invalid-argument', firstError);
    }

    const { query } = parseResult.data;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
      // 3. 検索 & AI パイプライン
      if (apiKey) {
        console.info(`[searchObject] Executing live Gemini Google Search Grounding for: "${query}"`);
        const result = await executeGeminiSearch(query, apiKey);
        return result;
      } else {
        console.info(`[searchObject] GEMINI_API_KEY is not set. Falling back to Mock response for: "${query}"`);
        const result = getMockSearchResponse(query);
        return result;
      }
    } catch (err: unknown) {
      // セキュアなエラーハンドリング: 内部スタックトレースやパス、外部APIキーを絶対に返却しない
      console.error('searchObject internal error:', err);
      throw new HttpsError(
        'internal',
        '安全に検索処理を完了できませんでした。時間をおいて再試行してください。'
      );
    }
  }
);
