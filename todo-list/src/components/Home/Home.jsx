import React from 'react';
import Create from '../Create/Create';

function Home() {
  const [todos, setTodos] = React.useState([]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-center">TodoList</h1>
      <Create setTodos={setTodos} todos={todos} /> 

      {todos.length === 0 && (
        <div className="text-center mt-4 text-gray-400">No todos</div>
      )}

      <div className="mt-6 flex-grow">
        {todos.map((todo, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-md mb-2 shadow-md"
          >
            {todo}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;