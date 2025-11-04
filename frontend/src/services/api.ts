import { Todo } from '../types/todo';

const DEFAULT_API_URL = 'http://localhost:8787/api';
const API_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL).replace(/\/$/, '');

// APIエラーハンドリング
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'APIリクエストに失敗しました');
  }
  //レスポンスが空の場合（例　DELETEリクエスト）
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;//空のレスポンスの場合
};

// Todoリストの取得
export const fetchTodos = async (): Promise<Todo[]> => {
  console.log('✅ APIリクエスト: GET /todos');
  const response = await fetch(`${API_URL}/todos`);
  const data = await handleResponse(response);
  console.log('✅ APIレスポンス:', data);
  return data;
};

// 新しいTodoの作成
export const createTodo = async (text: string): Promise<Todo> => {
  console.log('✅ APIリクエスト: POST /todos', { text, completed: false });
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, completed: false }),
  });
  const data = await handleResponse(response);
  console.log('✅ APIレスポンス:', data);
  return data;
};

// Todoの更新
export const updateTodo = async (id: number, data: Partial<Todo>): Promise<Todo> => {
  console.log(`✅ APIリクエスト: PUT /todos/${id}`, data);
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const responseData = await handleResponse(response);
  console.log('✅ APIレスポンス:', responseData);
  return responseData;
};

// Todoの削除
export const deleteTodo = async (id: number): Promise<void> => {
  console.log(`✅ APIリクエスト: DELETE /todos/${id}`);
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  const data = await handleResponse(response);
  console.log('✅ APIレスポンス:', data);
  return data;
};

// Todoの完了状態を切り替え
export const toggleTodo = async (id: number): Promise<Todo> => {
  console.log(`✅ APIリクエスト: PATCH /todos/${id}/toggle`);
  const response = await fetch(`${API_URL}/todos/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await handleResponse(response);
  console.log('✅ APIレスポンス:', data);
  return data;
};
