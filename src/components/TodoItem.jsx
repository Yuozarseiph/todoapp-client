import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Check, X } from 'lucide-react';

function TodoItem({ todo, onToggle, onDelete, onUpdate, darkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority
  });

  const handleUpdate = () => {
    onUpdate(todo._id, editData);
    setIsEditing(false);
  };

  const priorityColors = {
    low: darkMode 
      ? 'bg-green-800 text-green-300 border-green-600' 
      : 'bg-green-100 text-green-700 border-green-300',
    medium: darkMode 
      ? 'bg-yellow-800 text-yellow-300 border-yellow-600' 
      : 'bg-yellow-100 text-yellow-700 border-yellow-300',
    high: darkMode 
      ? 'bg-red-800 text-red-300 border-red-600' 
      : 'bg-red-100 text-red-700 border-red-300'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            rows="2"
          />
          <select
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdate}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Save
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(todo._id)}
            className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              todo.completed
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500'
                : darkMode 
                  ? 'border-gray-600 hover:border-purple-500' 
                  : 'border-gray-300 hover:border-purple-500'
            }`}
          >
            {todo.completed && <Check size={16} className="text-white" />}
          </motion.button>

          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${todo.completed ? 'line-through opacity-50' : ''} ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`text-sm mt-1 ${todo.completed ? 'line-through opacity-50' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[todo.priority]}`}>
                {todo.priority}
              </span>
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {new Date(todo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditing(true)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-blue-400 hover:bg-blue-900' 
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Edit2 size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(todo._id)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-red-400 hover:bg-red-900' 
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default TodoItem;
