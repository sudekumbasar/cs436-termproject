import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    api.get('/todos').then(res => setTodos(res.data));
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await api.post('/todos', { task: text });
    setTodos([...todos, res.data]);
    setText('');
  };

  const toggleDone = async todo => {
    const res = await api.put(`/todos/${todo._id}`, {
      task: todo.task,
      done: !todo.done
    });
    setTodos(todos.map(t => t._id === todo._id ? res.data : t));
  };

  const deleteTodo = async id => {
    await api.delete(`/todos/${id}`);
    setTodos(todos.filter(t => t._id !== id));
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Yeni görev"
      />
      <button onClick={addTodo}>Ekle</button>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <span
              onClick={() => toggleDone(todo)}
              style={{
                textDecoration: todo.done ? 'line-through' : 'none',
                cursor: 'pointer'
              }}
            >
              {todo.task}
            </span>
            <button onClick={() => deleteTodo(todo._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


