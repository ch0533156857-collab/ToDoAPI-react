
import React, { useEffect, useState } from 'react';
import service from './service.js';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true); // מצב טעינה
  const [error, setError] = useState(null);     // טיפול בשגיאות

  async function getTodos() {
    try {
      setLoading(true);
      setError(null);
      const todos = await service.getTasks();
      console.log('Fetched todos:', todos); // DEBUG
      setTodos(todos);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  async function createTodo(e) {
    e.preventDefault();
    try {
      await service.addTask(newTodo);
      setNewTodo(""); // clear input
      await getTodos(); // refresh tasks list
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
    }
  }

  async function updateCompleted(todo, isComplete) {
    try {
      await service.setCompleted(todo.id, isComplete);
      await getTodos(); // refresh tasks list
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  }

  async function deleteTodo(id) {
    try {
      await service.deleteTask(id);
      await getTodos(); // refresh tasks list
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={createTodo}>
          <input
            className="new-todo"
            placeholder="Well, let's take on the day"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </form>
      </header>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <section className="main" style={{ display: loading ? "none" : "block" }}>
        {todos.length === 0 && <p>No tasks yet</p>}
        <ul className="todo-list">
          {todos.map(todo => (
            <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={(e) => updateCompleted(todo, e.target.checked)}
                />
                <label>{todo.name}</label>
                <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}

export default App;
