
export default function Header({ onOpenModal, onLogout }) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <i className="fas fa-list-check text-blue-500"></i> Task Manager
        </h1>
        <p className="text-slate-400 text-sm mt-1">Django REST Framework API Interface</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onOpenModal('create')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <i className="fas fa-plus text-xs"></i>
          <span>Create Task</span>
        </button>
        <button
          onClick={onLogout}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium px-4 py-2.5 rounded-xl transition-all"
        >
          Logout
        </button>
      </div>
    </header>
  );
}