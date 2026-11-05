import React from 'react';
import { SearchObjectResponse } from '../types';
import { ConfidenceBadge } from './ConfidenceBadge';
import { SourceBadge } from './SourceBadge';
import { ExternalLink, AlertOctagon, HelpCircle, CheckCircle, Tag, Layers } from 'lucide-react';

interface Props {
  data: SearchObjectResponse;
  onFollowUpClick?: (text: string) => void;
}

export const ResultCard: React.FC<Props> = ({ data, onFollowUpClick }) => {
  return (
    <div className="result-card">
      {/* 1. ヘッダー: 特定対象と分類 */}
      <div className="result-card-header">
        <div className="result-title-section">
          <div className="result-object-name">
            <span className="object-label">特定対象:</span>
            <h3>{data.identifiedObject}</h3>
          </div>
          <div className="result-category">
            <Layers size={14} />
            <span>{data.category}</span>
          </div>
        </div>
        <div className="result-badges">
          <ConfidenceBadge confidence={data.confidence} />
        </div>
      </div>

      {/* 2. 判定ステータス */}
      <div className="verdict-banner">
        <div className="verdict-tag">
          <CheckCircle size={15} />
          <span>判定結果:</span>
          <strong>{data.verdict}</strong>
        </div>
      </div>

      {/* 3. 詳細回答本文 */}
      <div className="result-section">
        <h4 className="section-title">
          <Tag size={15} />
          回答・特定仕様
        </h4>
        <div className="result-answer-text">
          <p>{data.answer}</p>
        </div>
      </div>

      {/* 4. 注意事項 (適合性や安全上の注意) */}
      {data.caution && (
        <div className="result-section caution-box">
          <div className="caution-header">
            <AlertOctagon size={16} className="text-warning" />
            <strong>注意事項・適合条件</strong>
          </div>
          <p className="caution-text">{data.caution}</p>
        </div>
      )}

      {/* 5. 不足情報・追加の質問（存在する場合） */}
      {data.needsMoreInformation && data.followUpQuestion && (
        <div className="result-section follow-up-box">
          <div className="follow-up-header">
            <HelpCircle size={16} className="text-info" />
            <strong>適合性を確定するための確認事項（追加質問）</strong>
          </div>
          <pre className="follow-up-text">{data.followUpQuestion}</pre>
          {onFollowUpClick && (
            <div className="follow-up-actions">
              <span className="follow-up-hint">※車検証や銘板の記載内容をご返信ください。</span>
            </div>
          )}
        </div>
      )}

      {/* 6. 根拠・出典リスト (クリック可能URL & 情報源種別) */}
      <div className="result-section sources-section">
        <h4 className="section-title">
          <ExternalLink size={15} />
          根拠・出典情報源 (一次情報照合)
        </h4>
        <div className="sources-list">
          {data.sources.map((src, index) => (
            <div key={index} className="source-item">
              <div className="source-info">
                <SourceBadge type={src.type} />
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                  title={`${src.title} を開く`}
                >
                  <span className="source-title">{src.title}</span>
                  <ExternalLink size={12} className="external-icon" />
                </a>
              </div>
              <span className="source-publisher">発行元: {src.publisher}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
