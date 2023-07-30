import React, { useState, useEffect, useRef } from 'react';
import { EditIcon, SmallAddIcon, DeleteIcon } from '@chakra-ui/icons'
import './App.css'
const App = () => {
  const [todos, setTodos] = useState(() => {
    const storedTodos = JSON.parse(localStorage.getItem("myTodos"));
    return storedTodos || [];
  });
  const [todo, setTodo] = useState({ text: '', id: Date.now(), isCompleted: false });
  const inputRef = useRef(null);

  useEffect(() => {
    try{
      localStorage.setItem("myTodos",JSON.stringify(todos))
    }catch(e){
      localStorage.removeItem("myTodos")
    }
   

  }, [todos]);
  useEffect(() => {
    try{
      localStorage.setItem("myTodos",JSON.stringify(todos))
    }catch(e){
      localStorage.removeItem("myTodos")
    }
   

  }, []);
  const handleAddTodo = () => {
    if (todo.text.trim() === '') {
      return; // Prevent adding empty todos
    }

    setTodos([...todos, todo]);
    setTodo({ text: '', id: Date.now(), status: false });
    inputRef.current.focus();
  };

  const handleEdit = (id, newText) => {
    setTodos((prevTodos) =>prevTodos.map((todo) => todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  const handleRemoveTodo = (id) => {
    setTodos(prevTodos=>prevTodos.filter(todo=>todo.id != id))
  };

  const handleCheckbox = (id) => {
    setTodos(prevTodos=>prevTodos.map(todo=>todo.id=== id ? {...todo, isCompleted: !todo.isCompleted}:todo))
  };

  const handleOnSubmit = (e) => {
    e.preventDefault()
    handleAddTodo();
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to reset your list?')) {
      setTodos([])
      localStorage.removeItem("myTodos");
    } else {
      // Do nothing!
      return;
    }
    
  };



  return (
    <>
      <h1>To Do List App</h1>
      <div class="container">
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter a task"
          value={todo.text}
          onChange={(e) => setTodo({ ...todo, text: e.target.value })}
        />
        <button type="submit"><SmallAddIcon/></button>
        <button class="reset" onClick={handleClearAll}>Reset</button>
      </form>

      {todos.map((todoitem) => (
        <div class="todo-item" key={todoitem.id}>
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
          
          <button class="item-button"
            onClick={() => {
              const editedText = prompt('Edit the task:', todoitem.text);
              if (editedText !== null) {
                handleEdit(todoitem.id, editedText);
              }
            }}
          >
            <EditIcon/>
          </button>
          <button class="item-button" onClick={() => handleRemoveTodo(todoitem.id)}><DeleteIcon /></button>
        </div>
      ))}
      </div>
    </>
  );
};

export default App;
