import React from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  isMock: boolean;
}

export const Header: React.FC<Props> = ({ isMock }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <div className="brand-icon">
            <Cpu size={24} />
          </div>
          <div className="brand-texts">
            <h1 className="app-title">型式、物品検索AI</h1>
            <p className="app-subtitle">
              推測ではなく「公式一次情報・根拠」に基づき適合・型式を特定する技術検索エンジン
            </p>
          </div>
        </div>

        <div className="header-meta">
          {isMock ? (
            <div className="status-badge mock-badge" title="ローカルのモックデータで安全にUIを検証しています">
              <span className="dot mock-dot"></span>
              Local Mock モード
            </div>
          ) : (
            <div className="status-badge live-badge" title="Firebase Cloud Functions (asia-northeast1) 連携中">
              <span className="dot live-dot"></span>
              Firebase Callable 連携中
            </div>
          )}

          <div className="security-tag" title="ブラウザ側APIキー非保持・App Check・SSRF防止・個人情報非保存">
            <ShieldCheck size={14} />
            <span>Security First 設計</span>
          </div>
        </div>
      </div>
    </header>
  );
};
