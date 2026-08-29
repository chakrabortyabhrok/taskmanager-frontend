
// export default function App() {
//   return <RegisterPage />;
// }

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Stats from './components/Stats';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import RegistrationForm from './components/RegisterPage';
import Login from './components/Login';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token') || '');

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

  // const authorizeLogin = async () => {
  //   const data = await res.json();
  //   localStorage.setItem('access_token', data.access);
  //   setToken(data.access);
  //   showToast('Logged in successfully!');

  // }

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

    // Fixed: added /api prefix
    fetch(`${API_BASE}/api/tasks/${queryStr}`, {
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
      // Fixed: added /api prefix
      const res = await fetch(`${API_BASE}/api/tasks/${task.id}/`, {
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
    // Fixed: added /api prefix
    const url = isEdit ? `${API_BASE}/api/tasks/${taskData.id}/` : `${API_BASE}/api/tasks/`;
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
      // Fixed: added /api prefix
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}/`, {
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

  // Toast Component shared across views
  const renderToast = () => (
    toast && (
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
    )
  );

  // Render Login Screen if unauthenticated

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {renderToast()}
        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      {renderToast()}

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


// if (!token) {
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 relative">
//       {renderToast()}
//       <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
//             <i className="fas fa-list-check text-blue-500"></i> Task Manager
//           </h2>
//           <p className="text-slate-400 text-sm mt-1">Sign in with Django API credentials</p>
//         </div>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
//             <input
//               type="text"
//               required
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
//           >
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }