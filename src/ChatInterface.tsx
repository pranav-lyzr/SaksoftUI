// ChatInterface.tsx
import React, { useEffect, useRef, useState } from 'react';
import ChatMessage, { Message, ChatbotType } from './ChatMessage';
import ChatInput from './ChatInput';
import { Search, Lightbulb } from 'lucide-react';

interface ChatInterfaceProps {
  type: ChatbotType;
  messages: Message[];
  onSendMessage: (content: string) => void;
  title: string;
  description: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  type, 
  messages,
  onSendMessage,
  title, 
  description 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    const tempMessageId = `temp-${Date.now()}`;
    setLoadingMessageId(tempMessageId);
    setIsLoading(true);
    
    try {
      await onSendMessage(content);
    } finally {
      setIsLoading(false);
      setLoadingMessageId(null);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] max-h-[900px] min-h-[500px] w-full max-w-[1400px] mx-auto flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">

      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              type === 'search' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {type === 'search' ? 'Search' : 'Default'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="mb-4 text-4xl">
                {type === 'search' ? <Search className="w-8 h-8 ml-20" /> : <Lightbulb className="w-8 h-8 ml-20" />}
              </div>
              <p className="text-sm">Start by sending your first message</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message,index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                botType={type} 
                isLoading={isLoading && index === messages.length - 1 && message.role === 'assistant'}
              />
            ))}
            
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <ChatInput 
          onSendMessage={handleSend}
          isLoading={isLoading && loadingMessageId !== null}
          placeholder={`Ask about ${type === 'search' ? 'existing code...' : 'generating code...'}`}
        />
      </div>
    </div>
  );
};

export default ChatInterface;