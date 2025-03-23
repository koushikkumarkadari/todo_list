import React, { useEffect, useState } from 'react';
import Create from '../Create/Create';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Home() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      fetchTodos(storedUsername);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchTodos = async (username) => {
    const token = localStorage.getItem('token');
    try {
      const result = await axios.get(`http://localhost:3001/get/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(result.data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      if (err.response && err.response.status === 401) {
        // Token expired or invalid, redirect to login
        handleLogout();
      }
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/delete/${username}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos(username);
    } catch (err) {
      console.error('Error deleting todo:', err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (editedTodo) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3001/edit/${username}/${editedTodo._id}`,
        editedTodo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodos(username);
      setIsEditModalOpen(false);
      setEditingTodo(null);
    } catch (err) {
      console.error('Error editing todo:', err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTodo(null);
  };

  const handleComplete = async (todo) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3001/update/${username}/${todo._id}`,
        { done: !todo.done },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodos(username);
    } catch (err) {
      console.error('Error completing todo:', err);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Remove username
    navigate('/login');
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">TodoList</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"
        >
          Logout
        </button>
      </div>
      <Create username={username} fetchTodos={fetchTodos} />

      {todos.length === 0 && (
        <div className="text-center mt-4 text-gray-400">No todos</div>
      )}

      <div className="mt-6 flex-grow">
        {todos.map((todo, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-md mb-2 shadow-md flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleComplete(todo)}
                className="text-green-500 hover:text-green-600"
              >
                {todo.done ? <FaCheckCircle /> : <FaRegCircle />}
              </button>
              <span className={todo.done ? 'line-through text-gray-600' : ''}>
                {todo.newTodo}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(todo)}
                className="text-blue-500 hover:text-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isEditModalOpen && (
        <EditTodoModal
          todo={editingTodo}
          onSave={handleSaveEdit}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
}

function EditTodoModal({ todo, onSave, onClose }) {
  const [editedTodo, setEditedTodo] = useState({ ...todo });

  const handleInputChange = (e) => {
    setEditedTodo({ ...editedTodo, newTodo: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-black p-8 rounded-md">
        <input
          type="text"
          value={editedTodo.newTodo}
          onChange={handleInputChange}
          className="text-black m-2 h-10 w-full p-2 rounded-md"
        />
        <button className="m-2 bg-green" onClick={() => onSave(editedTodo)}>
          Save
        </button>
        <button className="m-2 bg-red" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Home;