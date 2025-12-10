import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';
import { sendMessageToGemini, ChatMessage } from '../../services/gemini';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isError?: boolean;
}

interface ChatProps {
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  isLoggedIn?: boolean;
  onNewChat?: () => void;
  shouldReset?: boolean;
}

const Chat: React.FC<ChatProps> = ({ toggleSidebar, isSidebarOpen, shouldReset }) => {
  const { isAuthenticated, user } = useAuth();
  const [textInput, setTextInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (shouldReset) {
      setChatHistory([]);
      setTextInput('');
      setIsProcessing(false);
    }
  }, [shouldReset]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isProcessing]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [textInput]);

  const onSendMessage = async () => {
    if (!textInput.trim() || isProcessing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: textInput,
      sender: 'user',
    };

    setChatHistory(prev => [...prev, userMsg]);
    setTextInput('');
    setIsProcessing(true);

    try {
      const conversation: ChatMessage[] = chatHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      
      conversation.push({ role: 'user', content: userMsg.text });

      conversation.unshift({
        role: 'system',
        content: `Você é a Serena AI, uma terapeuta virtual acolhedora, empática e profissional. Seu objetivo é escutar ativamente, validar os sentimentos do usuário e oferecer suporte emocional. O nome do usuário é ${user?.name || 'Visitante'}.`
      });

      const response = await sendMessageToGemini(conversation);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
      };
      
      setChatHistory(prev => [...prev, aiMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Erro',
        sender: 'ai',
        isError: true
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {(!isSidebarOpen || window.innerWidth <= 768) && (
            <div className="action-icon" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </div>
          )}
          <div className="model-selector">
            Serena AI 
            <span className="model-version" style={{ marginLeft: '8px' }}>
              {isAuthenticated ? 'Versão Pro' : 'Versão Free'}
            </span> 
          </div>
        </div>
        
        <div className="top-actions">
           {isAuthenticated && (
             <div className="action-icon">
               <span style={{ fontSize: '14.4px', fontWeight: 500 }}>{user?.name?.[0]?.toUpperCase()}</span>
             </div>
           )}
        </div>
      </div>

      <div className={`chat-main ${chatHistory.length > 0 ? 'has-messages' : ''}`}>
        {chatHistory.length === 0 ? (
          <div className="empty-state-content">
            <h1 className="greeting-text">
              {isAuthenticated ? `Bem-vindo de volta, ${user?.name?.split(' ')[0]}` : 'Como posso ajudar?'}
            </h1>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.sender} ${msg.isError ? 'error-message' : ''}`}>
               <div className="message-avatar">
                 {msg.sender === 'ai' ? 'S' : (user?.name?.[0]?.toUpperCase() || 'R')}
               </div>
               <div className="message-content">
                 {msg.text}
               </div>
            </div>
          ))
        )}
        
        {isProcessing && (
          <div className="message-row ai">
             <div className="message-avatar">S</div>
             <div className="message-content loading-dots">
               <span>.</span><span>.</span><span>.</span>
             </div>
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>

      <div className="footer-container">
        <div className="input-box">
          <textarea
            ref={inputRef}
            className="chat-textarea"
            placeholder="Pergunte qualquer coisa"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={isProcessing}
          />
          <div className="input-actions">
             <button 
               className={`action-btn ${textInput.trim() ? 'send-btn-active' : ''}`} 
               onClick={onSendMessage}
               disabled={!textInput.trim() || isProcessing}
             >
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
