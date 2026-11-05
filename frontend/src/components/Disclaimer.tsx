import React, { useState } from 'react';
import { AlertTriangle, Info, ChevronDown, ChevronUp, ShieldCheck, Lock } from 'lucide-react';

export const Disclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="disclaimer-container">
      <div className="disclaimer-bar" onClick={() => setIsOpen(!isOpen)}>
        <div className="disclaimer-bar-left">
          <Info size={16} className="text-info" />
          <span>最重要設計思想とご利用上の安全規約（クリックで開閉）</span>
        </div>
        <button type="button" className="expand-button" aria-label="詳細を開く">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isOpen && (
        <div className="disclaimer-details">
          <div className="policy-grid">
            <div className="policy-card">
              <h4>
                <ShieldCheck size={16} />
                根拠重視（ハルシネーションの排除）
              </h4>
              <p>
                本システムはAI独自の知識だけで型式・適合性を断定しません。
                「メーカー公式製品ページ」「公式PDF図面」「純正パーツリスト」等の一次情報URLを照合し、確度をつけて回答します。
              </p>
            </div>

            <div className="policy-card">
              <h4>
                <AlertTriangle size={16} />
                車・バイク部品の慎重な取扱
              </h4>
              <p>
                年式・型式・エンジン型式・仕向地によって同一車種名でも部品が異なる場合があります。
                適合の確証が得られない場合は推測せず「候補」として提示し、追加情報をお伺いします。
              </p>
            </div>

            <div className="policy-card">
              <h4>
                <Lock size={16} />
                プライバシー & 会社情報の完全分離
              </h4>
              <p>
                車台番号や個人を特定する情報は恒久保存しません。
                また、本アプリは公開Webアプリであり、社内SharePoint・社内メール・非公開台帳等には一切接続しません。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
