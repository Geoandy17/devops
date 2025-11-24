'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Charger les todos au démarrage
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/todos`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des tâches');
      const data = await response.json();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Impossible de charger les tâches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la création');
      
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (err) {
      setError('Impossible de créer la tâche');
      console.error(err);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      fetchTodos();
    } catch (err) {
      setError('Impossible de mettre à jour la tâche');
      console.error(err);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      fetchTodos();
    } catch (err) {
      setError('Impossible de supprimer la tâche');
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 DevOps Todo App
          </h1>
          <p className="text-gray-600 mb-8">
            Projet d&apos;apprentissage CI/CD avec Next.js + Node.js + PostgreSQL
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Formulaire d'ajout */}
          <form onSubmit={addTodo} className="mb-8">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Titre de la tâche"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description (optionnelle)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                ➕ Ajouter une tâche
              </button>
            </div>
          </form>

          {/* Liste des todos */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Chargement...</div>
          ) : (
            <div className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune tâche. Créez-en une pour commencer ! 🎯
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`border rounded-lg p-4 transition duration-200 ${
                      todo.completed
                        ? 'bg-gray-50 border-gray-300'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id, todo.completed)}
                          className="mt-1 w-5 h-5 cursor-pointer"
                        />
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold ${
                              todo.completed
                                ? 'line-through text-gray-500'
                                : 'text-gray-800'
                            }`}
                          >
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className="text-gray-600 mt-1">{todo.description}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 font-bold ml-4"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total: {todos.length} tâches</span>
              <span>Complétées: {todos.filter((t) => t.completed).length}</span>
              <span>En cours: {todos.filter((t) => !t.completed).length}</span>
            </div>
          </div>
        </div>

        {/* Section DevOps Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-3">📚 Concepts DevOps démontrés</h2>
          <ul className="space-y-2">
            <li>✅ <strong>Conteneurisation</strong> - Docker & Docker Compose</li>
            <li>✅ <strong>CI/CD</strong> - GitHub Actions (build, test, deploy)</li>
            <li>✅ <strong>Orchestration</strong> - Kubernetes manifests</li>
            <li>✅ <strong>Monitoring</strong> - Prometheus & Grafana</li>
            <li>✅ <strong>Infrastructure as Code</strong> - Configuration automatisée</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

