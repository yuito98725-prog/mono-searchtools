import { httpsCallable } from 'firebase/functions';
import { getAppFunctions } from './firebase';
import { SearchObjectResponse } from '../types';
import { findMockResponse } from './mockData';

// 環境変数で明示的にMockモードを無効化しない限り、初期状態では安全なローカルMockモードで動作
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

/**
 * モノ特定・根拠検索 API を呼び出す
 */
export async function searchMono(query: string): Promise<SearchObjectResponse> {
  const trimmed = query.trim();

  // クライアント側入力バリデーション
  if (!trimmed) {
    throw new Error('検索キーワードを入力してください。');
  }
  if (trimmed.length < 2) {
    throw new Error('検索キーワードは2文字以上入力してください。');
  }
  if (trimmed.length > 300) {
    throw new Error('検索キーワードは300文字以内で入力してください。');
  }

  // 1. Mockモードの場合（バックエンド未起動時やUI先行開発用）
  if (USE_MOCK) {
    console.info('[API] Using Local Mock Provider for query:', trimmed);
    // 自然な通信遅延をシミュレート (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));
    return findMockResponse(trimmed);
  }

  // 2. 本番またはエミュレータ経由の Callable Function 呼出し
  try {
    const functions = getAppFunctions();
    const callable = httpsCallable<{ query: string }, SearchObjectResponse>(functions, 'searchObject');
    const result = await callable({ query: trimmed });
    return result.data;
  } catch (error: any) {
    console.error('[API] Callable Function Error:', error);
    // エラーサニタイズ: ユーザーに不親切なエラーやスタックトレースを隠し、安全な文言に変換
    if (error.code === 'failed-precondition') {
      throw new Error('セキュリティ検証 (App Check) に失敗しました。正規のブラウザからアクセスしてください。');
    }
    if (error.code === 'invalid-argument') {
      throw new Error(error.message || '入力内容が正しくありません。');
    }
    throw new Error(error.message || '検索処理中にエラーが発生しました。時間をおいて再試行してください。');
  }
}

export function isMockMode(): boolean {
  return USE_MOCK;
}
