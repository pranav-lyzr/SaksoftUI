// Index.tsx
import { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import type { Message } from './ChatMessage';
import { codeGenerate, codeSearch } from './services/api';

const Index = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [chatType, setChatType] = useState<'search' | 'generate'>('generate');
  const [searchMessages, setSearchMessages] = useState<Message[]>([]);
  const [generateMessages, setGenerateMessages] = useState<Message[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // In handleSendMessage function in Index.tsx
  const handleSendMessage = async (type: 'search' | 'generate', content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
  
    const setMessages = type === 'search' ? setSearchMessages : setGenerateMessages;
    setMessages(prev => [...prev, newMessage]); // Only add user message initially
  
    try {
      let streamContent = '';
      const botMessageId = `bot-${Date.now()}`;
      
      // Create a single bot message that will be updated
      setMessages(prev => [...prev, {
        id: botMessageId,
        role: 'assistant',
        content: streamContent,
        timestamp: new Date(),
      }]);
  
      const onChunk = (chunk: string) => {
        streamContent += chunk;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.id === botMessageId) {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: streamContent }
            ];
          }
          return prev;
        });
      };
  
      const apiResponse = type === 'search' 
        ? await codeSearch(content, onChunk)
        : await codeGenerate(content, onChunk);
  
      if (apiResponse.error) {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage.id === botMessageId) {
            return [
              ...prev.slice(0, -1),
              { ...lastMessage, content: `Error: ${apiResponse.error}` }
            ];
          }
          return prev;
        });
      }
    } catch (error) {
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            content: 'Failed to connect to the API server. Please try again later.'
          }
        ];
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12">
      <header className="max-w-7xl mx-auto mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-4">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
            <span className={`text-lg font-medium ${chatType === 'search' ? 'text-blue-600' : 'text-gray-400'}`}>
              Code Search
            </span>
            
            <button 
              onClick={() => setChatType(t => t === 'search' ? 'generate' : 'search')}
              className="relative h-7 w-14 bg-gray-200 rounded-full transition-colors"
            >
              <div 
                className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white shadow-lg transform transition-transform ${
                  chatType === 'generate' ? 'translate-x-7' : 'translate-x-1'
                }`} 
              />
            </button>

                        
            <span className={`text-lg font-medium ${chatType === 'generate' ? 'text-purple-600' : 'text-gray-400'}`}>
              Default
            </span>
          </div>
        </h1>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className={`transition-all duration-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <ChatInterface 
            key={chatType}
            type={chatType}
            messages={chatType === 'search' ? searchMessages : generateMessages}
            onSendMessage={(content) => handleSendMessage(chatType, content)}
            title={chatType === 'search' ? "Code Search" : "Default"}
            description={chatType === 'search' 
              ? "Find relevant code snippets in your codebase" 
              : "Create new code from natural language descriptions"}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;