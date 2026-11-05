import React from 'react';
import { SourceType } from '../types';
import { FileText, CheckCircle2, Building, ShoppingBag, Globe, BookOpen } from 'lucide-react';

interface Props {
  type: SourceType;
}

export const SourceBadge: React.FC<Props> = ({ type }) => {
  switch (type) {
    case 'official':
      return (
        <span className="source-tag source-official">
          <CheckCircle2 size={12} />
          メーカー公式
        </span>
      );
    case 'official_pdf':
      return (
        <span className="source-tag source-pdf">
          <FileText size={12} />
          公式PDF / 図面
        </span>
      );
    case 'official_manual':
      return (
        <span className="source-tag source-manual">
          <BookOpen size={12} />
          純正パーツリスト / 取説
        </span>
      );
    case 'primary_public':
      return (
        <span className="source-tag source-public">
          <Building size={12} />
          公的・規格一次情報
        </span>
      );
    case 'authorized_distributor':
      return (
        <span className="source-tag source-distributor">
          <Building size={12} />
          正規代理店 / 認定DB
        </span>
      );
    case 'general_marketplace':
      return (
        <span className="source-tag source-market">
          <ShoppingBag size={12} />
          販売サイト (参考)
        </span>
      );
    case 'reference':
    default:
      return (
        <span className="source-tag source-ref">
          <Globe size={12} />
          参考情報
        </span>
      );
  }
};
