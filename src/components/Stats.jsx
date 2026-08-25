
export default function Stats({ tasks }) {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Tasks</p>
          <h2 className="text-2xl font-bold text-white mt-1">{total}</h2>
        </div>
        <div className="p-3 bg-slate-800 text-blue-400 rounded-xl"><i className="fas fa-tasks text-lg"></i></div>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To Do</p>
          <h2 className="text-2xl font-bold text-blue-400 mt-1">{todo}</h2>
        </div>
        <div className="p-3 bg-blue-950/50 text-blue-400 rounded-xl"><i className="fas fa-clock text-lg"></i></div>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress</p>
          <h2 className="text-2xl font-bold text-amber-400 mt-1">{inProgress}</h2>
        </div>
        <div className="p-3 bg-amber-950/50 text-amber-400 rounded-xl"><i className="fas fa-spinner text-lg"></i></div>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</p>
          <h2 className="text-2xl font-bold text-emerald-400 mt-1">{done}</h2>
        </div>
        <div className="p-3 bg-emerald-950/50 text-emerald-400 rounded-xl"><i className="fas fa-check-circle text-lg"></i></div>
      </div>
    </div>
  );
}