import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
export type MessageRole = "user" | "assistant";
export type ChatbotType = "search" | "generate";

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
  isLoading: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, botType, isLoading }) => {
  const [displayContent, setDisplayContent] = useState('');

  useEffect(() => {
    setDisplayContent(message.content);
  }, [message.content]);

  const isUser = message.role === "user";

  // Add a function to clean and prepare markdown content
  const prepareMarkdownContent = (content: string) => {
    return content
      .replace(/^\s*\.\s*/, '') // Remove leading dot
      .replace(/\\u2019/g, "'") // Fix unicode apostrophes
      .replace(/\\n/g, '\n') // Fix escaped newlines
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .replace(/(?:^|\n)###\s*/g, '\n\n### ') // Fix header formatting
      .trim();
  };

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-6 animate-fade-up animate-once`}
      style={{ animationDelay: "100ms" }}
    >
      <div
        className={`
          max-w-[90%] sm:max-w-[80%] px-5 py-4 rounded-2xl shadow-sm 
          ${
            isUser
              ? "bg-purple-600 text-white rounded-br-none"
              : "bg-white border border-gray-100 rounded-bl-none shadow-md"
          }
        `}
      >
        {isUser ? (
          <div className="text-white font-medium">{message.content}</div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center mb-3">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  botType === "search" ? "bg-blue-500" : "bg-purple-500"
                }`}
              />
              <span className="text-sm font-medium text-gray-500">
                {botType === "search" ? "Code Search" : "Default"}
              </span>
              {!isLoading && (
                <span className="text-xs text-gray-400 ml-auto">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
            {
              <div className="prose prose-sm max-w-none text-gray-800">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    code: ({ inline, children, className }: CodeProps) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : 'text';
                      const codeContent = String(children).replace(/\n$/, '');

                      return inline ? (
                        <code className="inline-code bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                          {codeContent}
                        </code>
                      ) : (
                        <div className="relative group">
                          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigator.clipboard.writeText(codeContent)}
                              className="text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
                            >
                              Copy
                            </button>
                          </div>
                          <SyntaxHighlighter
                            language={language}
                            style={materialLight}
                            customStyle={{
                              margin: 0,
                              padding: '1rem',
                              backgroundColor: '#f8fafc',
                              fontSize: '0.875rem',
                              borderRadius: '0.375rem',
                            }}
                          >
                            {codeContent}
                          </SyntaxHighlighter>
                        </div>
                      );
                    },
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-600">{children}</li>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="font-semibold mt-3 mb-1 text-gray-900">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => {
                      if (!children) return null;

                      // Convert children to string and clean up whitespace
                      const rawText = React.Children.toArray(children)
                        .map((child) =>
                          typeof child === "string" ? child : ""
                        )
                        .join("")
                        .trim();

                      // Skip empty paragraphs or just newlines
                      if (!rawText || rawText === "\n" || rawText === "\n\n") {
                        return null;
                      }

                      // Handle single word/short phrases
                      const isSingleWord =
                        rawText.split(/\s+/).length === 1 &&
                        rawText.length <= 20;

                      return isSingleWord ? (
                        <span className="inline-block mr-2 last:mr-0">
                          {children}
                        </span>
                      ) : (
                        <p className="mb-4 leading-relaxed text-gray-700">
                          {children}
                        </p>
                      );
                    },
                    // Add break line handler
                    br: () => <br className="mb-4" />,
                    // Add pre handler for code blocks
                    pre: ({ children }) => (
                      <pre className="mb-4 overflow-x-auto">{children}</pre>
                    ),
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-gray-200 pl-4 italic my-4 text-gray-600">
                        {children}
                      </blockquote>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
                    ),
                    hr: () => <hr className="my-6 border-gray-200" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full divide-y divide-gray-200">
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {prepareMarkdownContent(displayContent || (isLoading ? '▋' : ''))}
                </ReactMarkdown>
              </div>
}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
