import React from 'react';
import ReactMarkdown from 'react-markdown';
// import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import LoadingDots from './LoadingDots';
export type MessageRole = 'user' | 'assistant';
export type ChatbotType = 'search' | 'generate';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}


export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
  botType: ChatbotType;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, botType, isLoading }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-up animate-once`}
      style={{ animationDelay: '100ms' }}
    >
      <div
        className={`
          max-w-[90%] sm:max-w-[80%] px-5 py-4 rounded-2xl shadow-sm 
          ${isUser 
            ? 'bg-purple-600 text-white rounded-br-none' 
            : 'bg-white border border-gray-100 rounded-bl-none shadow-md'
          }
        `}
      >
        {isUser ? (
          <div className="text-white font-medium">{message.content}</div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center mb-3">
              <div className={`w-2 h-2 rounded-full mr-2 ${botType === 'search' ? 'bg-blue-500' : 'bg-purple-500'}`} />
              <span className="text-sm font-medium text-gray-500">
                {botType === 'search' ? 'Code Search' : 'Default'}
              </span>
                {!isLoading && (
                <span className="text-xs text-gray-400 ml-auto">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                )}
            </div>
            {isLoading ? (
              <div className="min-h-[24px] flex items-center">
                <LoadingDots />
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                    code: ({ inline, children, className }: CodeProps) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return inline ? (
                        <code className="inline-code bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <SyntaxHighlighter
                          language={match ? match[1] : 'typescript'}
                          style={materialLight}
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            backgroundColor: '#f8fafc',
                            fontSize: '0.875rem'
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      );
                    },
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                    li: ({ children }) => <li className="text-gray-600">{children}</li>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900">{children}</h3>,
                    h4: ({ children }) => <h4 className="font-semibold mt-3 mb-1 text-gray-900">{children}</h4>,
                    p: ({ children }) => {
                      const rawText = React.Children.toArray(children).join('').trim();
                      const isSingleWord = rawText.split(/\s+/).length === 1 && rawText.length <= 20;
                      console.log("RAW TEXT and single word", rawText, isSingleWord);
                      return isSingleWord ? (
                        <span className="inline-block mr-2 last:mr-0">{children}</span>
                      ) : (
                        <p className="mb-4 leading-relaxed text-gray-700">{children}</p>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
