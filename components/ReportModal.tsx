
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { getMotivationalMessage } from '../services/geminiService';

interface ReportModalProps {
  tasks: Task[];
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ tasks, onClose }) => {
  const [motivation, setMotivation] = useState<string>("Yuklanmoqda...");

  useEffect(() => {
    getMotivationalMessage().then(setMotivation);
  }, []);

  const completedTasks = tasks.filter(t => t.completed);
  const incompleteTasks = tasks.filter(t => !t.completed);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Bugungi Hisobot</h2>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">✅ Bajarilgan vazifalar</h3>
            {completedTasks.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                {completedTasks.map(task => <li key={task.id}>{task.text}</li>)}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">Hozircha bajarilgan vazifalar yo'q.</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">❌ Bajarilmagan vazifalar</h3>
             {incompleteTasks.length > 0 ? (
              <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                {incompleteTasks.map(task => <li key={task.id}>{task.text}</li>)}
              </ul>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">Barcha vazifalar bajarildi! Barakalla!</p>
            )}
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
             <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">🧠 Motivatsion xabar</h3>
             <p className="text-slate-700 dark:text-slate-200 italic p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
                "{motivation}"
             </p>
          </div>
        </div>

        <div className="p-6 flex justify-end space-x-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold">
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
