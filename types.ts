
export interface Task {
  id: number;
  time: string;
  text: string;
  completed: boolean;
}

export interface Message {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
}
