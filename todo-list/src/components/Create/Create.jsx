import React, { useState } from 'react';
import axios from 'axios';
const url="https://todo-list-backend-ya74.onrender.com"
function Create({ username, fetchTodos }) {
  const [newTodo, setNewTodo] = useState('');


  const handleSubmit = (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault(); // Prevent default form submission
    axios
      .post(`${url}/add/${username}`, { newTodo: newTodo },{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((result) => {
        console.log(result);
        setNewTodo(''); // Clear input after successful add
        fetchTodos(username); // Refresh todo list
      })
      .catch((err) => console.log(err));
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