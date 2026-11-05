import React, { useState } from 'react';
import { Search, Loader2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SAMPLE_QUERIES = [
  '2014年式CB1100のオイルフィルター',
  'BMアクセラ2.0 6MTのブレーキパッド',
  '外径47 内径20 幅14の深溝玉軸受',
  'オムロン E2E-X10MF1 の後継機種',
  'ハイエースのタイヤ'
];

export const SearchInput: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSamples, setShowSamples] = useState(true);

  const trimmed = input.trim();
  const charCount = input.length;
  const isValidLength = trimmed.length >= 2 && trimmed.length <= 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!trimmed) {
      setError('探したいモノの情報を入力してください。');
      return;
    }
    if (trimmed.length < 2) {
      setError('2文字以上入力してください。');
      return;
    }
    if (trimmed.length > 300) {
      setError('300文字以内で入力してください。');
      return;
    }

    setError(null);
    onSearch(trimmed);
  };

  const handleSampleClick = (sample: string) => {
    if (isLoading) return;
    setInput(sample);
    setError(null);
    onSearch(sample);
  };

  return (
    <div className="search-input-wrapper">
      {/* 入力フォーム */}
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-field-container">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            placeholder="探したいモノを入力 (型式・車種・年式・寸法・特徴など)..."
            rows={1}
            className="search-textarea"
            disabled={isLoading}
            onKeyDown={(e) => {
              // PCではEnterキーで送信、Shift+Enterで改行
              if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 640) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <div className="input-toolbar">
            <div className="char-counter">
              <span className={charCount > 300 ? 'text-danger' : ''}>{charCount}</span>/300字
              {charCount > 0 && charCount < 2 && <span className="counter-warning"> (2文字以上)</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isValidLength}
              className="submit-button"
              title="検索を実行"
              aria-label="検索を実行"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="spin-icon" />
                  <span className="btn-text">検索中...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span className="btn-text">検索</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && <div className="input-error-message">{error}</div>}
      </form>

      {/* サンプルクエリバー (横スワイプ対応 & 開閉可能) */}
      <div className="samples-wrapper">
        <div className="samples-header" onClick={() => setShowSamples(!showSamples)}>
          <div className="samples-label">
            <Sparkles size={13} className="text-primary" />
            <span>入力例（タップで即時検索）</span>
          </div>
          <button type="button" className="sample-toggle-btn" aria-label="入力例の開閉">
            {showSamples ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {showSamples && (
          <div className="sample-tags-scroll">
            {SAMPLE_QUERIES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                className="sample-tag-button"
                onClick={() => handleSampleClick(sample)}
                disabled={isLoading}
              >
                {sample}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
