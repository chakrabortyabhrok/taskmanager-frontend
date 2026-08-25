import { useState, useEffect } from 'react';
import Header from './components/Header';
import Stats from './components/Stats';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // JWT Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Invalid username or password');
      const data = await res.json();
      localStorage.setItem('access_token', data.access);
      setToken(data.access);
      showToast('Logged in successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken('');
    setTasks([]);
  };

  // Fetch Tasks with JWT Auth

  const fetchTasks = () => {
    if (!token) return;
    setLoading(true);

    let queryParams = [];
    if (statusFilter) queryParams.push(`status=${statusFilter}`);
    if (categoryFilter) queryParams.push(`category=${encodeURIComponent(categoryFilter)}`);
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);

    const queryStr = queryParams.length ? `?${queryParams.join('&')}` : '';

    fetch(`${API_BASE}/tasks/${queryStr}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          handleLogout();
          throw new Error('Session expired. Please log in again.');
        }
        if (!res.ok) {
          // Prevent JSON.parse on HTML error pages
          const text = await res.text();
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        const results = Array.isArray(data) ? data : data.results || [];
        setTasks(results);
        setLoading(false);
      })
      .catch((err) => {
        showToast(err.message, 'error');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, [token, statusFilter, categoryFilter, search]);

  // Cycle Status (To Do -> In Progress -> Done)
  const handleCycleStatus = async (task) => {
    const nextMap = { todo: 'in_progress', in_progress: 'done', done: 'todo' };
    const nextStatus = nextMap[task.status] || 'todo';

    try {
      const res = await fetch(`${API_BASE}/tasks/${task.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast(`Status updated`);
        fetchTasks();
      }
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  // Save Task (Create or Update)
  const handleSaveTask = async (taskData) => {
    const isEdit = Boolean(taskData.id);
    const url = isEdit ? `${API_BASE}/tasks/${taskData.id}/` : `${API_BASE}/tasks/`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        showToast(`Task ${isEdit ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        fetchTasks();
      } else {
        showToast(`Failed to save task`, 'error');
      }
    } catch {
      showToast('Server error', 'error');
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast('Task deleted');
        fetchTasks();
      }
    } catch {
      showToast('Error deleting task', 'error');
    }
  };

  // Render Login Screen if unauthenticated
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <i className="fas fa-list-check text-blue-500"></i> Task Manager
            </h2>
            <p className="text-slate-400 text-sm mt-1">Sign in with Django API credentials</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-xl ${toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/90 border-rose-800 text-rose-200'
              }`}
          >
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle text-emerald-400' : 'fa-exclamation-circle text-rose-400'}`}></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <Header
        onOpenModal={() => {
          setTaskToEdit(null);
          setIsModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      <Stats tasks={tasks} />

      <FilterBar
        search={search}
        setSearch={setSearch}
        status={statusFilter}
        setStatus={setStatusFilter}
        category={categoryFilter}
        setCategory={setCategoryFilter}
        onRefresh={fetchTasks}
      />

      <TaskList
        tasks={tasks}
        loading={loading}
        onCycleStatus={handleCycleStatus}
        onEdit={(task) => {
          setTaskToEdit(task);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteTask}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
















// import { useEffect, useState } from 'react';

// function App() {
//   const [token, setToken] = useState(localStorage.getItem('access_token') || '');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [tasks, setTasks] = useState([]);
//   const [error, setError] = useState('');

//   // 1. Handle Login Request
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password }),
//       });

//       if (!res.ok) throw new Error('Invalid credentials');

//       const data = await res.json();
//       localStorage.setItem('access_token', data.access);
//       setToken(data.access);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // 2. Fetch Tasks using the stored Token
//   // Fetch Tasks using stored Token
//   useEffect(() => {
//     if (!token) return;

//     fetch('http://127.0.0.1:8000/api/tasks/', {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         if (res.status === 401) {
//           // Token expired or invalid
//           handleLogout();
//           throw new Error('Session expired. Please log in again.');
//         }
//         if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
//         return res.json();
//       })
//       .then((data) => {
//         // Handle DRF pagination ({ results: [...] }) OR plain arrays ([...])
//         if (Array.isArray(data)) {
//           setTasks(data);
//         } else if (data && Array.isArray(data.results)) {
//           setTasks(data.results);
//         } else {
//           setTasks([]);
//         }
//       })
//       .catch((err) => {
//         setError(err.message);
//         setTasks([]);
//       });
//   }, [token]);

//   // 3. Handle Logout
//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     setToken('');
//     setTasks([]);
//   };

//   // Render Login Form if no Token exists
//   if (!token) {
//     return (
//       <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '400px' }}>
//         <h2>Login to Task Manager</h2>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <form onSubmit={handleLogin}>
//           <div style={{ marginBottom: '10px' }}>
//             <input
//               type="text"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               style={{ width: '100%', padding: '8px' }}
//               required
//             />
//           </div>
//           <div style={{ marginBottom: '10px' }}>
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={{ width: '100%', padding: '8px' }}
//               required
//             />
//           </div>
//           <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }

//   // Render Tasks once authenticated
//   return (
//     <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <h2>My Django Tasks ({tasks.length})</h2>
//         <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>
//           Logout
//         </button>
//       </div>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <ul>
//         {tasks.map((task) => (
//           <li key={task.id}>
//             <strong>{task.title}</strong> {task.completed ? '✅' : '⏳'}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;