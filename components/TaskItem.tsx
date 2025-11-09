
import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete }) => {
  return (
    <div
      className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
        task.completed
          ? 'bg-green-100 dark:bg-green-900/50 text-slate-500 dark:text-slate-400'
          : 'bg-white dark:bg-slate-800'
      }`}
    >
      <div className="flex-shrink-0 w-16 text-center">
        <span className={`font-bold text-lg ${task.completed ? 'line-through' : 'text-indigo-600 dark:text-indigo-400'}`}>
          {task.time}
        </span>
      </div>
      <div className="flex-grow ml-4">
        <p className={`text-slate-800 dark:text-slate-200 ${task.completed ? 'line-through' : ''}`}>
          {task.text}
        </p>
      </div>
      <button
        onClick={() => onToggleComplete(task.id)}
        className={`flex-shrink-0 flex items-center justify-center w-24 h-10 rounded-full text-sm font-semibold transition-colors duration-300 ${
          task.completed
            ? 'bg-green-500 text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-green-200 dark:hover:bg-green-700'
        }`}
      >
        {task.completed ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Bajarildi
          </>
        ) : (
          'Belgilash'
        )}
      </button>
    </div>
  );
};

export default TaskItem;
