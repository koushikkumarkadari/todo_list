import React, { useState } from 'react';
import axios from 'axios';

function Create({ setTodos, todos }) {
  const [newTodo, setNewTodo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim() !== '') {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
    axios.post("http://localhost:3001/add",{newTodo:newTodo})
    .then(result=>console.log(result))
    .catch(err=>console.log(err))
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex-row flex justify-between">
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo..."
        className="bg-gray-700 text-white p-2 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 m-2"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md m-2"
      >
        Add Todo
      </button>
    </form>
  );
}

export default Create;