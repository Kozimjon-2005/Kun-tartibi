import React, { useState } from 'react';
import { Task } from '../types';

interface EditModalProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ tasks, setTasks, onClose }) => {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('08:00');
  
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [overTaskId, setOverTaskId] = useState<number | null>(null);


  const handleTaskChange = (id: number, field: 'time' | 'text', value: string) => {
    setLocalTasks(localTasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setLocalTasks(localTasks.filter(task => task.id !== id));
  };

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      time: newTaskTime,
      text: newTaskText,
      completed: false
    };
    setLocalTasks([...localTasks, newTask]);
    setNewTaskText('');
    setNewTaskTime('08:00');
  };
  
  const handleSave = () => {
    setTasks(localTasks);
    onClose();
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId.toString());
  };

  const handleDragOver = (e: React.DragEvent, taskId: number) => {
    e.preventDefault();
    if (draggedTaskId !== null && taskId !== draggedTaskId && taskId !== overTaskId) {
      setOverTaskId(taskId);
    }
  };

  const handleDrop = (e: React.DragEvent, dropTargetId: number) => {
    e.preventDefault();
    if (draggedTaskId === null || draggedTaskId === dropTargetId) {
      return;
    }

    const draggedItemIndex = localTasks.findIndex(t => t.id === draggedTaskId);
    const dropTargetIndex = localTasks.findIndex(t => t.id === dropTargetId);

    if (draggedItemIndex === -1 || dropTargetIndex === -1) return;

    const newTasks = [...localTasks];
    const [draggedItem] = newTasks.splice(draggedItemIndex, 1);
    newTasks.splice(dropTargetIndex, 0, draggedItem);

    setLocalTasks(newTasks);
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setOverTaskId(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kun Tartibini Tahrirlash</h2>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-4">
          {localTasks.map(task => (
            <div 
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onDragOver={(e) => handleDragOver(e, task.id)}
              onDrop={(e) => handleDrop(e, task.id)}
              onDragEnd={handleDragEnd}
              onDragLeave={() => setOverTaskId(null)}
              className={`flex items-center space-x-3 bg-white dark:bg-slate-900 p-3 rounded-lg transition-all duration-200 ease-in-out
                ${draggedTaskId === task.id ? 'opacity-40 scale-95 shadow-lg' : 'shadow-sm'}
                ${overTaskId === task.id && draggedTaskId !== task.id ? 'outline outline-2 outline-offset-2 outline-indigo-500' : ''}
              `}
            >
              <div className="cursor-move text-slate-400 dark:text-slate-500" title="O'rnini o'zgartirish">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  <path strokeLinecap="round" d="M9.75 21.75l-3-3m0 0l3-3m-3 3h9.75" />
                  <path strokeLinecap="round" d="M14.25 2.25l3 3m0 0l-3 3m3-3H7.5" />
                </svg>
              </div>
              <input 
                type="time"
                value={task.time}
                onChange={(e) => handleTaskChange(task.id, 'time', e.target.value)}
                className="w-24 p-2 rounded-md bg-slate-200 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              />
              <input 
                type="text"
                value={task.text}
                onChange={(e) => handleTaskChange(task.id, 'text', e.target.value)}
                className="flex-grow p-2 rounded-md bg-slate-200 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              />
              <button 
                onClick={() => handleDeleteTask(task.id)}
                className="p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
                aria-label="Vazifani o'chirish"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Yangi Vazifa Qo'shish</h3>
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-3 rounded-lg">
              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="w-24 p-2 rounded-md bg-slate-200 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              />
              <input
                type="text"
                placeholder="Vazifa matni..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-grow p-2 rounded-md bg-slate-200 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              />
              <button 
                onClick={handleAddTask}
                className="p-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                aria-label="Yangi vazifa qo'shish"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-end space-x-4 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-semibold">
            Bekor qilish
          </button>
          <button onClick={handleSave} className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold">
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
