import React, { useState, useEffect, useRef } from 'react';
import { EditIcon, SmallAddIcon, DeleteIcon } from '@chakra-ui/icons';
import './App.css';

//todoitem component that contains checkbox, the task, remove and edit button
const ToDoItem =({ todoitem, handleCheckbox, handleEdit, handleRemoveTodo })=>{
  return(
    <div className="todo-item" key={todoitem.id}>
    <input
      type="checkbox"
      checked={todoitem.isCompleted}
      onChange={() => handleCheckbox(todoitem.id)}
    />
    <span
      style={todoitem.isCompleted ? { textDecoration: 'line-through' } : null}
    >
      {todoitem.text}
    </span>

    <button className="item-button"
      onClick={() => {
        const editedText = prompt('Edit the task:', todoitem.text);
        if (editedText !== null) {
          handleEdit(todoitem.id, editedText);
        }
      }}
    >
      <EditIcon />
    </button>
    <button className="item-button" onClick={() => handleRemoveTodo(todoitem.id)}><DeleteIcon /></button>
  </div>
  )
}

const App = () => {
  // State to manage the list of todos
  const [todos, setTodos] = useState(() => {
    const storedTodos = JSON.parse(localStorage.getItem("myTodos"));
    return storedTodos || [];
  });

  // State to manage the input for adding new todo
  const [todo, setTodo] = useState({ text: '', id: Date.now(), isCompleted: false });

  // Reference to the input field for adding new todo
  const inputRef = useRef(null);

  // Save todos in localStorage whenever 'todos' state changes
  useEffect(() => {
    try {
      localStorage.setItem("myTodos", JSON.stringify(todos));
    } catch (e) {
      // In case there's an error, remove the 'myTodos' from localStorage
      localStorage.removeItem("myTodos");
    }
  }, [todos]);

  // On initial load, retrieve todos from localStorage and set the state
  useEffect(() => {
    try {
      const storedTodos = JSON.parse(localStorage.getItem("myTodos"));
      if (storedTodos) {
        setTodos(storedTodos);
      }
    } catch (e) {
      
      localStorage.removeItem("myTodos");
    }
  }, []);

  // Add a new todo to the list
  const handleAddTodo = () => {
    if (todo.text.trim() === '') {
      return; 
    }
    setTodos([...todos, todo]);
    setTodo({ text: '', id: Date.now(), isCompleted: false });
    inputRef.current.focus();
  };

  // Edit a todo in the list
  const handleEdit = (id, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // Remove a todo from the list
  const handleRemoveTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // Handle checkbox toggle for a todo
  const handleCheckbox = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  // Handle form submission for adding a new todo
  const handleOnSubmit = (e) => {
    e.preventDefault();
    handleAddTodo();
  };

  // Handle clearing all todos
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to reset your list?')) {
      setTodos([]);
      localStorage.removeItem("myTodos");
    } else {
      return;
    }
  };

  // Render the To-Do List App
  return (
    <>
      <h1>To Do List App</h1>
      <div className="container">
        <form onSubmit={handleOnSubmit}>
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter a task"
            value={todo.text}
            onChange={(e) => setTodo({ ...todo, text: e.target.value })}
          />
          <button type="submit"><SmallAddIcon /></button>
          <button className="reset" onClick={handleClearAll}>Reset</button>
        </form>

        {todos.map((todoitem) => (
          <ToDoItem 
            todoitem={todoitem} 
            handleCheckbox={handleCheckbox} 
            handleEdit={handleEdit}
            handleRemoveTodo={handleRemoveTodo}
            />
        ))}
      </div>
    </>
  );
};

export default App;
