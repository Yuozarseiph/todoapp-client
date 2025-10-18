import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import { todoService } from '../services/api';

function TodoList({ darkMode }) {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await todoService.getTodos();
      setTodos(response.data.todos);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      const response = await todoService.createTodo(todoData);
      setTodos([response.data.todo, ...todos]);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const response = await todoService.toggleTodo(id);
      setTodos(todos.map(todo => todo._id === id ? response.data.todo : todo));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    try {
      const response = await todoService.updateTodo(id, updates);
      setTodos(todos.map(todo => todo._id === id ? response.data.todo : todo));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortOption === 'createdAt_asc') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortOption === 'createdAt_desc') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortOption === 'priority_asc') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortOption === 'priority_desc') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return 0;
  });

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {[
          { label: 'Total', value: stats.total, color: 'purple', borderColor: darkMode ? 'border-purple-400' : 'border-purple-500' },
          { label: 'Active', value: stats.active, color: 'blue', borderColor: darkMode ? 'border-blue-400' : 'border-blue-500' },
          { label: 'Completed', value: stats.completed, color: 'green', borderColor: darkMode ? 'border-green-400' : 'border-green-500' }
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl p-4 shadow-md border-l-4 ${stat.borderColor}`}
          >
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{stat.label}</p>
            <p className={`text-3xl font-bold ${darkMode ? `text-${stat.color}-400` : `text-${stat.color}-600`}`}>{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Todo Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowForm(!showForm)}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 mb-6 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
      >
        <Plus size={24} />
        Add New Todo
      </motion.button>

      {/* Todo Form */}
      <AnimatePresence>
        {showForm && (
          <TodoForm
            onSubmit={handleAddTodo}
            onCancel={() => setShowForm(false)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Completion Filter */}
        <div className={`flex gap-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-2 shadow-md`}>
          {['all', 'active', 'completed'].map(f => (
            <motion.button
              key={`filter-${f}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`py-2 px-4 rounded-lg font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className={`flex gap-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-2 shadow-md`}>
          {['all', 'low', 'medium', 'high'].map(p => (
            <motion.button
              key={`priority-${p}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPriorityFilter(p)}
              className={`py-2 px-4 rounded-lg font-medium capitalize transition-all ${
                priorityFilter === p
                  ? 'bg-gradient-to-r from-green-500 to-lime-500 text-white'
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              {p}
            </motion.button>
          ))}
        </div>

        {/* Sort Options */}
        <select
          aria-label="Sort todos"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-lg px-3 py-2 shadow-md`}
        >
          <option value="createdAt_desc">Newest first</option>
          <option value="createdAt_asc">Oldest first</option>
          <option value="priority_desc">Highest priority first</option>
          <option value="priority_asc">Lowest priority first</option>
        </select>
      </div>

      {/* Todo List */}
      {loading ? (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
          />
        </div>
      ) : sortedTodos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md`}
        >
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>No todos found</p>
        </motion.div>
      ) : (
        <motion.div layout className="space-y-3">
          <AnimatePresence>
            {sortedTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
                darkMode={darkMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

export default TodoList;
