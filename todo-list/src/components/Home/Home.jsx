import React, { useEffect, useState } from 'react';
import Create from '../Create/Create';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa'; // Import icons

function Home() {
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/get`)
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3001/delete/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (editedTodo) => {
    axios
      .put(`http://localhost:3001/edit/${editedTodo._id}`, editedTodo)
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo._id === editedTodo._id ? editedTodo : todo
          )
        );
        setIsEditModalOpen(false);
        setEditingTodo(null);
      })
      .catch((err) => console.log(err));
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTodo(null);
  };

  const handleComplete = (todo) => {
    axios.put(`http://localhost:3001/update/`+todo._id)
      .then((result) => console.log(result))
      .then(() => {
        setTodos(
          todos.map((t) =>
            t._id === todo._id ? { ...t, done: !t.done } : t
          )
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">TodoList</h1>
      <Create />

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
      )}    </div>
  );
}

function EditTodoModal({ todo, onSave, onClose }) {
  const [editedTodo, setEditedTodo] = useState({ ...todo });

  const handleInputChange = (e) => {
    setEditedTodo({ ...editedTodo, newTodo: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-md">
        <input
          type="text"
          value={editedTodo.newTodo}
          onChange={handleInputChange}
        />
        <button onClick={() => onSave(editedTodo)}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default Home;