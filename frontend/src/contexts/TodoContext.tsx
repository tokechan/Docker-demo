import React, { createContext, useContext } from 'react';
import { Todo, FilterStatus } from '../types/todo';
import { useTodos } from '../hooks/useTodos';

// コンテキストの型定義

interface TodoContextType {
  todos: Todo[];
  filterStatus: FilterStatus;
  loading: boolean;
  error: string | null;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (id: number, text: string) => Promise<void>;
  setFilterStatus: (status: FilterStatus) => void;
  refreshTodos: () => Promise<Todo[] | undefined>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

// プロバイダーコンポーネント
export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    todos,
    filterStatus,
    loading,
    error,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    setFilterStatus,
    refreshTodos,
  } = useTodos();

  // コンテキスト値
  const contextValue: TodoContextType = {
    todos,
    filterStatus,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilterStatus,
    refreshTodos,
  };

  return <TodoContext.Provider value={contextValue}>{children}</TodoContext.Provider>;
};

// カスタムフック
// eslint-disable-next-line react-refresh/only-export-components
export const useTodoContext = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodoContext must be used within a TodoProvider');
  }
  return context;
};
