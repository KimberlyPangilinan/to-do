import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [todos, setTodos] = useState(() => {
    const storedTodos = JSON.parse(localStorage.getItem("myTodos"));
    return storedTodos || [];
  });
  const [todo, setTodo] = useState({ text: '', id: Date.now(), status: false });
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("myTodos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (todo.text.trim() === '') {
      return; // Prevent adding empty todos
    }

    setTodos([...todos, todo]);
    setTodo({ text: '', id: Date.now(), status: false });
    inputRef.current.focus();
  };

  const handleRemoveTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    inputRef.current.focus();
  };

  const handleCheckbox = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, status: !todo.status } : todo
      )
    );
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    handleAddTodo();
  };

  const handleClear = (e) => {
    setTodos([]);
  };

  const handleEdit = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  return (
    <div>
      <h1>To Do List App</h1>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter a task"
          value={todo.text}
          onChange={(e) => setTodo({ ...todo, text: e.target.value })}
        />
        <button type="submit">Add</button>
        <button onClick={handleClear}>Reset</button>
      </form>

      {todos.map((todoitem) => (
        <div key={todoitem.id}>
          <input
            type="checkbox"
            checked={todoitem.status}
            onChange={() => handleCheckbox(todoitem.id)}
          />
          <span
            style={todoitem.status ? { textDecoration: 'line-through' } : null}
          >
            {todoitem.text}
          </span>
          <button onClick={() => handleRemoveTodo(todoitem.id)}>Remove</button>
          <button
            onClick={() => {
              const editedText = prompt('Edit the task:', todoitem.text);
              if (editedText !== null) {
                handleEdit(todoitem.id, editedText);
              }
            }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
