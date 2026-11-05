import React from 'react';
import { ConfidenceLevel } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle } from 'lucide-react';

interface Props {
  confidence: ConfidenceLevel;
}

export const ConfidenceBadge: React.FC<Props> = ({ confidence }) => {
  switch (confidence) {
    case 'high':
      return (
        <span className="badge badge-high" title="メーカー公式ページまたはPDFで完全一致が確認された信頼度">
          <ShieldCheck size={14} className="badge-icon" />
          確度: 高 (公式完全一致)
        </span>
      );
    case 'medium':
      return (
        <span className="badge badge-medium" title="複数の信頼できる情報源で一致が確認された信頼度">
          <ShieldAlert size={14} className="badge-icon" />
          確度: 中 (複数ソース一致)
        </span>
      );
    case 'low':
      return (
        <span className="badge badge-low" title="販売情報や二次情報のみのため参考扱い">
          <AlertTriangle size={14} className="badge-icon" />
          確度: 低 (二次情報/参考)
        </span>
      );
    case 'unknown':
    default:
      return (
        <span className="badge badge-unknown" title="根拠不足または情報源間に差異があるため要確認">
          <HelpCircle size={14} className="badge-icon" />
          確度: 要確認 (根拠不足/要追加情報)
        </span>
      );
  }
};
