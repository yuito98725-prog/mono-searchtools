import { SearchObjectResponse } from '../types';

export const MOCK_RESPONSES: Record<string, SearchObjectResponse> = {
  cb1100: {
    query: '2014年式CB1100のオイルフィルター',
    identifiedObject: 'ホンダ CB1100 (2010〜2021年式 / 型式: EBL-SC65, 2BL-SC65) 用 オイルフィルターエレメント',
    category: 'オートバイ部品 / エンジン系消耗品 / オイルフィルター',
    answer:
      '2014年式ホンダ CB1100（型式: EBL-SC65）のホンダ純正オイルフィルターの部番は「15410-MFJ-D01」（または統合代替部番「15410-MFJ-D02」）です。社外互換品としては、デイトナ「67926 / 98739」、ベスラ「SF-4007」、キジマ「105-508」がメーカー公式適合表で完全一致が確認されています。',
    verdict: '純正品番特定・社外適合品確認済',
    confidence: 'high',
    caution:
      '年式および仕向地（国内仕様 / 輸出仕様）によって部品構成が共通であることをパーツリストで確認していますが、取付時は必ず新品のOリング塗布と規定トルク（26 N・m）を厳守してください。',
    sources: [
      {
        title: 'Honda 二輪車純正部品・用品WEBカタログ (CB1100)',
        url: 'https://www.honda.co.jp/motor-parts/catalog/',
        type: 'official',
        publisher: '本田技研工業株式会社'
      },
      {
        title: 'Daytona 車種別オイルフィルター適合表 (HONDA)',
        url: 'https://www.daytona.co.jp/products/series-S00115',
        type: 'authorized_distributor',
        publisher: '株式会社デイトナ'
      },
      {
        title: 'Vesrah オイルフィルター適合データベース',
        url: 'https://catalog.vesrah.co.jp/',
        type: 'authorized_distributor',
        publisher: 'タカラ株式会社 (Vesrah)'
      }
    ],
    needsMoreInformation: false,
    followUpQuestion: null
  },
  axela: {
    query: 'BMアクセラ2.0 6MTのブレーキパッド',
    identifiedObject: 'マツダ アクセラスポーツ 2.0 ガソリン 6MT (型式: DBA-BMEFS) フロントブレーキパッド',
    category: '自動車部品 / ブレーキ系重要保安部品 / ブレーキパッド',
    answer:
      'BMアクセラ 2.0Lガソリン（BMEFS、PE-VPRエンジン、2013/11〜2016/07）のフロント純正ブレーキパッド部番は「B4Y0-33-28ZA」（または「B4Y0-33-28ZB」）です。DIXCEL（ディクセル）適合品ではECタイプ「351326」、エンドレス「EP510」が対応します。',
    verdict: '車両型式・純正品番・社外適合照合完了',
    confidence: 'high',
    caution:
      'ブレーキパッドは重要保安部品です。同世代のアクセラでも1.5L（BM5FS）やディーゼル2.2L（BM2FS）ではローター径およびキャリパー形状が異なり互換性がありません。必ず車検証の型式「DBA-BMEFS」をご確認の上、認証整備工場等で交換を行ってください。',
    sources: [
      {
        title: 'MAZDA PARTS CATALOG - AXELA BMEFS',
        url: 'https://www.mazda.co.jp/carlife/service/parts/',
        type: 'official',
        publisher: 'マツダ株式会社'
      },
      {
        title: 'DIXCEL 車種別ブレーキパーツ適合検索 (アクセラ BMEFS)',
        url: 'https://www.dixcel.co.jp/pad/pad_search.php',
        type: 'authorized_distributor',
        publisher: '株式会社ディクセル'
      }
    ],
    needsMoreInformation: false,
    followUpQuestion: null
  },
  bearing: {
    query: '外径47 内径20 幅14の深溝玉軸受',
    identifiedObject: '深溝玉軸受 呼び番号 6204 (内径20mm × 外径47mm × 幅14mm)',
    category: '産業機械部品 / 転がり軸受 / 深溝玉軸受 (ISO/JIS規格)',
    answer:
      '主要寸法「内径 20mm、外径 47mm、幅 14mm」に合致する標準深溝玉軸受のISO/JIS規格呼び番号は「6204」です。NTN製型番は「6204」（開放形）、「6204ZZ」（両側鋼板シールド）、「6204LLU」（両側非接触接触ゴムシール）となります。基本動定格荷重 Cr は 12.8 kN、基本静定格荷重 C0r は 6.65 kN です。',
    verdict: 'JIS B 1521 規格一致・主要メーカー型番照合完了',
    confidence: 'high',
    caution:
      '使用環境（回転数、防塵性、防水性、使用温度）に応じてシール種別（開放、鋼板シールドZZ、ゴムシールLLU/DDU）および内部すきま（普通、C3）を選定してください。',
    sources: [
      {
        title: 'NTN 転がり軸受総合カタログ (CAT. No. 2203/J)',
        url: 'https://www.ntn.co.jp/japan/products/catalog/pdf/bearing/',
        type: 'official_pdf',
        publisher: 'NTN株式会社'
      },
      {
        title: '日本精工(NSK) 標準単列深溝玉軸受 6200シリーズ寸法表',
        url: 'https://www.nsk.com/jp/products/bearings/ball/deepgroove/',
        type: 'official',
        publisher: '日本精工株式会社'
      }
    ],
    needsMoreInformation: false,
    followUpQuestion: null
  },
  omron: {
    query: 'オムロン E2E-X10MF1 の後継機種',
    identifiedObject: 'オムロン 近接センサ E2E-X10MF1 の後継機種選定',
    category: 'FA・制御機器 / 検出スイッチ / 近接センサ',
    answer:
      'オムロンの生産終了近接センサ「E2E-X10MF1」（直流3線式・M18・非シールド・検出距離10mm・NPN・NO）の推奨後継機種は「E2E-X10MF1-M1」または新世代NEXTシリーズ「E2E-X8MD1」等ですが、完全同一取付・同等機能の後継現行品は「E2E-X10MF1 2M」（標準コード長2m品）です。',
    verdict: 'メーカー公式生産終了・代替推奨照合完了',
    confidence: 'high',
    caution:
      'ケーブル引き出しタイプとコネクタ中継タイプ（M12コネクタ）の配線仕様の違いにご注意ください。また、NEXTシリーズへ置換する場合は検出距離仕様および応差特性が向上しているため、検出体の通過マージンを確認してください。',
    sources: [
      {
        title: 'オムロン 制御機器 商品情報・後継商品検索 (E2Eシリーズ)',
        url: 'https://www.fa.omron.co.jp/product/cautions/discontinued/',
        type: 'official',
        publisher: 'オムロン株式会社'
      },
      {
        title: 'E2E スタンダードタイプ 近接センサ カタログ (PDF)',
        url: 'https://www.fa.omron.co.jp/data_pdf/cat/e2e_ds_j_8_1.pdf',
        type: 'official_pdf',
        publisher: 'オムロン株式会社'
      }
    ],
    needsMoreInformation: false,
    followUpQuestion: null
  },
  hiace: {
    query: 'ハイエースのタイヤ',
    identifiedObject: 'トヨタ ハイエース（200系など）用タイヤ・ホイール適合',
    category: '自動車部品 / タイヤ・ホイール / 車検適合品',
    answer:
      'ハイエース用のタイヤは、バン（商用車・4ナンバー/1ナンバー）かワゴン/コミューター（乗用・3ナンバー/2ナンバー）かによって必要なロードインデックス（荷重指数）およびLT規格（商用バン用タイヤ）の要件が法的に大きく異なります。現時点の情報では確実な適合サイズを絞り込めません。',
    verdict: '情報不足による保留（要確認）',
    confidence: 'unknown',
    caution:
      'バン登録（4ナンバー等）の場合、通常の乗用車用タイヤ（サマータイヤ）を装着すると車検不適合となり整備不良の対象となります。',
    sources: [
      {
        title: '国土交通省 道路運送車両の保安基準 (タイヤの荷重許容限度)',
        url: 'https://www.mlit.go.jp/jidosha/jidosha_fr7_000007.html',
        type: 'primary_public',
        publisher: '国土交通省'
      },
      {
        title: 'トヨタ ハイエース 取扱説明書 (タイヤ空気圧・指定サイズ一覧)',
        url: 'https://manual.toyota.jp/hiace/',
        type: 'official_manual',
        publisher: 'トヨタ自動車株式会社'
      }
    ],
    needsMoreInformation: true,
    followUpQuestion:
      'より正確な適合サイズ・規格をご案内するために、以下の情報をお知らせいただけますか？\n1. ナンバー区分（例: 4ナンバー商用バン、1ナンバーワイドバン、または3ナンバー乗用ワゴン）\n2. 車検証に記載の「型式」（例: QDF-GDH201V, TRH200V など）\n3. 現在装着されているタイヤの表記（例: 195/80R15 107/105L LT など）'
  }
};

export function findMockResponse(query: string): SearchObjectResponse {
  const q = query.toLowerCase();
  if (q.includes('cb1100') || (q.includes('オイルフィルター') && q.includes('ホンダ'))) {
    return { ...MOCK_RESPONSES.cb1100, query };
  }
  if (q.includes('アクセラ') || (q.includes('ブレーキ') && q.includes('パッド'))) {
    return { ...MOCK_RESPONSES.axela, query };
  }
  if (q.includes('ベアリング') || q.includes('軸受') || (q.includes('47') && q.includes('20'))) {
    return { ...MOCK_RESPONSES.bearing, query };
  }
  if (q.includes('オムロン') || q.includes('e2e') || q.includes('後継')) {
    return { ...MOCK_RESPONSES.omron, query };
  }
  if (q.includes('ハイエース') && q.includes('タイヤ')) {
    return { ...MOCK_RESPONSES.hiace, query };
  }

  // デフォルト応答
  return {
    query,
    identifiedObject: `入力「${query}」に基づく対象製品候補`,
    category: '一般工業製品 / 機械・電気部品 / 消耗品',
    answer: `「${query}」について公式ドキュメントおよび技術仕様を検索・照合しました。主要メーカーの標準仕様および該当製品候補を特定しています。詳細な適合判定には、型番全体の末尾記号や使用電源・取り付け寸法などの情報照合が推奨されます。`,
    verdict: '候補特定・主要仕様照合完了',
    confidence: 'medium',
    caution:
      'メーカーのマイナーチェンジやロットにより仕様が異なる場合があります。最終発注前には必ず一次情報（メーカー公式カタログ等）をご確認ください。',
    sources: [
      {
        title: 'メーカー公式製品技術データベース',
        url: 'https://example.com/official-products',
        type: 'official',
        publisher: 'メーカー公式サイト'
      },
      {
        title: '工業規格・標準寸法照合テーブル (JIS/ISO)',
        url: 'https://example.com/standard-specs',
        type: 'primary_public',
        publisher: '標準規格推進協議会'
      }
    ],
    needsMoreInformation: false,
    followUpQuestion: null
  };
}
