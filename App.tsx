import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Task, Message } from './types';
import { DEFAULT_TASKS } from './constants';
import { getMotivationalMessage } from './services/geminiService';
import TaskItem from './components/TaskItem';
import EditModal from './components/EditModal';
import ReportModal from './components/ReportModal';
import ChatModal from './components/ChatModal';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [isEditing, setIsEditing] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'assistant', text: "Assalomu alaykum! Kun tartibini boshlaymizmi yoki o‘zgartirish kiritasizmi?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const completedTasksCount = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const progress = useMemo(() => (tasks.length > 0 ? (completedTasksCount / tasks.length) * 100 : 0), [completedTasksCount, tasks]);

  useEffect(() => {
    if(isChatOpen){
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);
  
  const handleToggleComplete = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const addMessage = (sender: 'user' | 'assistant', text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text }]);
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const lowerInput = userInput.trim().toLowerCase();
    addMessage('user', userInput);
    setUserInput('');
    setIsLoading(true);

    await new Promise(res => setTimeout(res, 500)); // Simulate thinking

    if (lowerInput.includes("o'zgartir")) {
        addMessage('assistant', "Albatta, tahrirlash rejimini ochyapman.");
        setIsChatOpen(false);
        setIsEditing(true);
    } else if (lowerInput.includes("progress") || lowerInput.includes("hisobot")) {
        addMessage('assistant', "Keling, bugungi natijalarni ko'rib chiqamiz.");
        setIsChatOpen(false);
        setShowReport(true);
    } else if (lowerInput.includes("motivatsiya")) {
        const motivation = await getMotivationalMessage();
        addMessage('assistant', motivation);
    } else {
        addMessage('assistant', "Kechirasiz, bu buyruqni tushunmadim. 'Rejamni o'zgartir', 'bugungi progress' yoki 'motivatsiya ber' so'zlarini sinab ko'ring.");
    }
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-slate-800 dark:text-slate-200">
      {isEditing && <EditModal tasks={tasks} setTasks={setTasks} onClose={() => setIsEditing(false)} />}
      {showReport && <ReportModal tasks={tasks} onClose={() => setShowReport(false)} />}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        userInput={userInput}
        setUserInput={setUserInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        chatEndRef={chatEndRef}
      />
      
      <main className="w-full max-w-4xl mx-auto bg-slate-200 dark:bg-slate-950/50 rounded-2xl shadow-2xl p-4 sm:p-8">
        <div>
          <header className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Kun Tartibi Assistant</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Bugungi rejangizni samarali boshqaring!</p>
          </header>

          {/* Progress Stickers */}
          <div className="mb-8 mt-4 px-4 sm:px-0">
            <div className="relative w-full h-16 flex items-center">
              {progress < 100 ? (
                <>
                  {/* Boy Sticker (Static on the right) */}
                  <span
                    className="text-4xl absolute z-10"
                    style={{
                      right: 0,
                      transform: 'translateY(-24px)',
                    }}
                    role="img"
                    aria-label="Boy"
                  >
                    👦
                  </span>

                  {/* Girl Sticker (Moves with progress) */}
                  <div
                    className="absolute z-10 transition-all duration-500 ease-linear"
                    style={{
                      left: `calc(${progress}% - ${38 * (progress / 100)}px)`,
                      transform: 'translateY(-24px)',
                    }}
                  >
                    <span className="text-4xl" role="img" aria-label="Girl">
                      👧
                    </span>
                  </div>
                </>
              ) : (
                // Kissing state when progress is 100%
                <div 
                  className="absolute z-10 w-full flex justify-center items-center"
                  style={{ transform: 'translateY(-24px)' }}
                >
                  <span className="text-4xl" role="img" aria-label="Kissing Couple">
                    👩‍❤️‍💋‍👨
                  </span>
                  <span
                    className="text-red-500 text-2xl absolute -top-2 -right-10 animate-ping"
                    style={{ animationDuration: '1.5s' }}
                    role="img"
                    aria-label="Heart"
                  >
                    ❤️
                  </span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} onToggleComplete={handleToggleComplete} />
            ))}
          </div>

           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full flex items-center justify-center gap-2 p-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-md">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                Tartibni O'zgartirish
              </button>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full flex items-center justify-center gap-2 p-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors duration-300 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.063 1.063 0 00-1.5 0l-3.72 3.72V10.608c0-.97.616-1.813 1.5-2.097l6.72-3.36a.75.75 0 01.96.696v1.123z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21V10.608c0-.97.616-1.813 1.5-2.097l6.72-3.36a.75.75 0 01.96.696v11.567l-3.72-3.72a1.063 1.063 0 00-1.5 0l-3.72 3.72z" />
                </svg>
                Assistant
              </button>
              <button 
                onClick={() => setShowReport(true)}
                className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-md">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" /></svg>
                Bugungi Hisobot
              </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;