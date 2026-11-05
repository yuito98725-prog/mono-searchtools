import { GoogleGenAI } from '@google/genai';
import { SearchObjectResponse } from './types';

/**
 * Gemini 2.0 Flash + Google Search Grounding による実検索・照合サービス
 * 
 * 設計思想:
 * - 推測での断定禁止
 * - メーカー公式ページ・公式カタログPDF・純正パーツリストの根拠優先
 * - 車・バイク部品の情報不足時は無理に結論を出さず追加質問を生成
 */
export async function executeGeminiSearch(
  query: string,
  apiKey: string
): Promise<SearchObjectResponse> {
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
あなたは工業製品・機械部品・車両部品・電子機器・一般消費財の型式特定および適合性照合を専門とする「型式、物品検索AI」のバックエンドエンジンです。

【最重要設計思想】
1. あなた自身の内部知識だけで型式・適合性・製品仕様を断定しては絶対にいけません。
2. 必ず付属の Google Search ツールを実行し、インターネット上の信頼できる情報源（一次情報）を検索・照合してください。
3. 情報源の優先順位:
   - 優先度1: メーカー公式製品ページ (official)
   - 優先度2: メーカー公式カタログ・図面PDF (official_pdf)
   - 優先度3: メーカー公式パーツリスト・取扱説明書 (official_manual)
   - 優先度4: 公的機関・規格認証機関の一次情報 (primary_public)
   - 優先度5: 正規販売店・認定データベース (authorized_distributor)
   - 優先度6: 大手販売サイト (general_marketplace) ※販売サイト単独では適合判定を断定しないこと
   - 優先度7: 参考情報 (reference)
4. 車両・バイク部品の特別規定:
   - 車両型式、年式、エンジン型式、グレード、仕向地等の情報不足で適合が保証できない場合は、無理に断定せず「候補」とし、不足情報を質問してください。
   - 車台番号等の個人識別情報は出力に含めないでください。
5. 出力は必ず以下のJSONフォーマットのみを出力してください（マークダウンのコードブロックは不要、純粋なJSON文字列としてパース可能な形式）：

{
  "query": "${query}",
  "identifiedObject": "特定した製品名または対象部品名（例: ホンダ CB1100 2014年式 オイルフィルター）",
  "category": "分類カテゴリ（例: バイク部品 / 消耗品 / フィルター）",
  "answer": "検索結果に基づく正確な回答（純正品番、仕様、互換品等）",
  "verdict": "判定ステータス（例: 公式特定完了 / 候補特定 / 要追加確認）",
  "confidence": "high または medium または low または unknown",
  "caution": "適合性や安全上の注意事項、交換時の注意点など",
  "sources": [
    {
      "title": "情報源のWebページタイトル",
      "url": "クリック可能な完全なURL",
      "type": "official または official_pdf または official_manual または primary_public または authorized_distributor または general_marketplace または reference",
      "publisher": "発行元・メーカー名"
    }
  ],
  "needsMoreInformation": true または false,
  "followUpQuestion": "情報不足時にユーザーへ確認する質問文、不足がなければ null"
}
`;

  const prompt = `探したいモノの情報: 「${query}」
Google Search を実行して公式一次情報を確認し、上記のJSONフォーマットで回答してください。`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }],
      temperature: 0.1 // ハルシネーション抑制のため低温度
    }
  });

  const text = response.text || '';
  
  // JSONパースの安全処理（マークダウンの ```json ``` を除去）
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();

  try {
    const parsed = JSON.parse(cleaned) as SearchObjectResponse;
    return parsed;
  } catch (parseError) {
    console.error('Gemini JSON Parse Error. Raw text:', text);
    // パース失敗時の安全なフォールバック構造
    return {
      query,
      identifiedObject: `検索対象: ${query}`,
      category: '工業製品・部品',
      answer: text.substring(0, 500),
      verdict: 'AI検索完了（要詳細確認）',
      confidence: 'medium',
      caution: '回答の自動構造化中に一部差異が発生しました。一次情報をご確認ください。',
      sources: [
        {
          title: 'Google Search 検索結果',
          url: 'https://www.google.com/search?q=' + encodeURIComponent(query),
          type: 'reference',
          publisher: 'Web検索'
        }
      ],
      needsMoreInformation: false,
      followUpQuestion: null
    };
  }
}
