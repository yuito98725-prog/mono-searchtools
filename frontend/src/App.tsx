import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchInput } from './components/SearchInput';
import { ResultCard } from './components/ResultCard';
import { Disclaimer } from './components/Disclaimer';
import { ChatMessage, SearchObjectResponse } from './types';
import { searchMono, isMockMode } from './services/api';
import { Bot, User, Trash2 } from 'lucide-react';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: '「型式、物品検索AI」へようこそ。\n型式が分からなくても、用途・車種・年式・主要寸法・特徴などから候補を絞り込み、メーカー公式ページや一次情報カタログを照合して根拠付きでお答えします。\n\n下の入力例をタップするか、探したいモノを自由に入力してください。'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSearch = async (query: string) => {
    const userMsgId = 'user-' + Date.now();
    const assistantMsgId = 'assistant-' + (Date.now() + 1);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // ユーザーメッセージを追加
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: nowTime,
      text: query
    };

    // AIのプレースホルダー（ローディング中）を追加
    const assistantLoadingMessage: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      timestamp: nowTime,
      isLoading: true
    };

    setMessages((prev) => [...prev, userMessage, assistantLoadingMessage]);
    setIsLoading(true);

    try {
      const response: SearchObjectResponse = await searchMono(query);

      // AIメッセージを結果で更新
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                isLoading: false,
                data: response
              }
            : msg
        )
      );
    } catch (err: any) {
      // エラー発生時の安全な表示
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                isLoading: false,
                error: err.message || '検索処理中にエラーが発生しました。'
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('チャット履歴をクリアしますか？')) {
      setMessages([
        {
          id: 'welcome-' + Date.now(),
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: 'チャット履歴を初期化しました。探したいモノの名称・用途・年式等を入力してください。'
        }
      ]);
    }
  };

  return (
    <div className="app-layout">
      {/* 1. ヘッダー (固定上部) */}
      <Header isMock={isMockMode()} />

      {/* 2. アプリ本体 (チャットスクロール領域 + 下部入力エリア) */}
      <div className="app-body">
        {/* チャットスクロール領域 */}
        <div className="chat-scroll-area" ref={scrollAreaRef}>
          <div className="chat-inner-container">
            {/* 免責・安全規定バー */}
            <Disclaimer />

            {/* チャットタイムライン */}
            <div className="chat-timeline">
              <div className="chat-toolbar">
                <span className="chat-count-label">検索対話セッション（端末一時メモリ）</span>
                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="clear-button"
                    title="表示をクリア"
                  >
                    <Trash2 size={13} />
                    <span>履歴クリア</span>
                  </button>
                )}
              </div>

              <div className="messages-list">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message-row ${message.sender === 'user' ? 'row-user' : 'row-assistant'}`}
                  >
                    <div className="message-avatar">
                      {message.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                    </div>

                    <div className="message-bubble-wrapper">
                      <div className="message-meta">
                        <span className="sender-name">
                          {message.sender === 'user' ? 'あなた' : '根拠検索AI'}
                        </span>
                        <span className="message-time">{message.timestamp}</span>
                      </div>

                      {message.text && (
                        <div className="message-text-bubble">
                          <p>{message.text}</p>
                        </div>
                      )}

                      {message.isLoading && (
                        <div className="loading-card">
                          <div className="loading-steps">
                            <div className="step-item active">
                              <span className="step-dot"></span>
                              <span>対象キーワードを解析・分類中...</span>
                            </div>
                            <div className="step-item active">
                              <span className="step-dot pulse"></span>
                              <span>メーカー公式ページ・一次情報カタログを照合中...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {message.data && (
                        <ResultCard
                          data={message.data}
                          onFollowUpClick={(extraInfo) => handleSearch(extraInfo)}
                        />
                      )}

                      {message.error && (
                        <div className="error-card">
                          <p className="error-text">⚠️ {message.error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {/* スクロール最下部アンカー */}
                <div ref={messagesEndRef} className="scroll-anchor" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. 入力エリア (Flexboxで画面最下部に固定配置) */}
        <div className="bottom-input-area">
          <div className="input-inner-container">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};
