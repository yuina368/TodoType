"use client";

import { useState, useEffect } from "react";

// Todoアイテムの型定義
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回マウント時: localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("next_todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("データのパースに失敗しました", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // todos更新時: localStorageへ保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("next_todos", JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  // タスクの追加
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputText.trim(),
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInputText("");
  };

  // 完了フラグの切り替え
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // タスクの削除
  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Todo App
        </h1>

        {/* 入力フォーム */}
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            追加
          </button>
        </form>

        {/* Todoリスト */}
        <ul className="space-y-2">
          {todos.length === 0 ? (
            <li className="text-center py-6 text-sm text-slate-400">
              タスクがありません
            </li>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 overflow-hidden mr-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span
                    className={`text-sm truncate cursor-pointer select-none ${
                      todo.completed
                        ? "line-through text-slate-400"
                        : "text-slate-700"
                    }`}
                    onClick={() => handleToggleTodo(todo.id)}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded transition-colors"
                >
                  削除
                </button>
                <button className="text-xs text-blue-500 hover:text-blue-700 font-medium px-2 py-1 rounded transition-colors">
                  優先度を高中低で選択できるようにする
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}