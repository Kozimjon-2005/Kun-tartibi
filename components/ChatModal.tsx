import React from 'react';
import { Message } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  userInput: string;
  setUserInput: (input: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, messages, userInput, setUserInput, handleSendMessage, isLoading, chatEndRef }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Assistant bilan Suhbat</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'assistant' && 
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 7.5v9.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  </div>
                }
                <div className={`max-w-xs md:max-w-sm rounded-2xl p-3 ${msg.sender === 'user' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && 
              <div className="flex items-end gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 7.5v9.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  </div>
                  <div className="rounded-2xl p-3 bg-slate-200 dark:bg-slate-700 rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
              </div>
            }
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Xabar yozing..."
                className="flex-1 p-2 rounded-lg bg-slate-200 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-200"
              />
              <button onClick={handleSendMessage} disabled={isLoading} className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};

export default ChatModal;
