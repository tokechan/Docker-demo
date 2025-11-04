import { useState, useEffect } from 'react';
import { Todo, FilterStatus } from '../types/todo';
import {
  fetchTodos,
  createTodo,
  updateTodo as apiUpdateTodo,
  deleteTodo as apiDeleteTodo,
} from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // APIからデータを取得
  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTodos();
      setTodos(data);
      return data;
    } catch (err) {
      console.error('Error loading todos:', err);
      setError('Todoの読み込みに失敗しました');
      // APIが失敗した場合はローカルストレージから読み込む
      try {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
          const parsedTodos = JSON.parse(storedTodos);
          if (Array.isArray(parsedTodos)) {
            setTodos(parsedTodos);
            return parsedTodos;
          }
        }
        return [];
      } catch (localError) {
        console.error('Error loading local todos:', localError);
        return [];
      }
    } finally {
      setLoading(false);
    }
  };

  // 初期化時にAPIからデータを読み込む
  useEffect(() => {
    loadTodos();
  }, []);

  // todosが変更されるたびにローカルストレージに保存する
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Todoの追加
  const addTodo = async (text: string) => {
    if (text.trim() === '') return;

    try {
      setLoading(true);
      setError(null);
      const newTodo = await createTodo(text.trim());
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Todoの追加に失敗しました');

      // APIが失敗した場合はローカルで追加
      const newTask: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
      };
      setTodos((prevTodos) => [...prevTodos, newTask]);
    } finally {
      setLoading(false);
    }
  };

  // Todoの完了状態を切り替え
  const toggleTodo = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;

      setLoading(true);
      setError(null);

      // 楽観的UI更新（即座に表示を更新）
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
      );

      // APIでの更新
      await apiUpdateTodo(id, { completed: !todoToUpdate.completed });
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError('Todoの状態更新に失敗しました');

      // APIが失敗した場合は元に戻す
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
      );
    } finally {
      setLoading(false);
    }
  };

  // Todoの編集
  const updateTodo = async (id: number, newText: string) => {
    if (newText.trim() === '') return;

    try {
      setLoading(true);
      setError(null);

      // 楽観的UI更新
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, text: newText.trim() } : todo))
      );

      // APIでの更新
      await apiUpdateTodo(id, { text: newText.trim() });
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Todoの更新に失敗しました');

      // エラーが発生した場合は元に戻すためにTodoを再取得
      loadTodos();
    } finally {
      setLoading(false);
    }
  };

  // Todoの削除
  const deleteTodo = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      // 楽観的UI更新
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      // APIでの削除
      await apiDeleteTodo(id);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Todoの削除に失敗しました');

      // エラーが発生した場合は元に戻すためにTodoを再取得
      loadTodos();
    } finally {
      setLoading(false);
    }
  };

  // フィルタリングされたTodosを取得
  const getFilteredTodos = () => {
    return todos.filter((todo) => {
      if (filterStatus === 'active') return !todo.completed;
      if (filterStatus === 'completed') return todo.completed;
      return true;
    });
  };

  return {
    todos: getFilteredTodos(),
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    filterStatus,
    setFilterStatus,
    loading,
    error,
    refreshTodos: loadTodos,
  };
};
