
export default function TaskCard({ task, onCycleStatus, onEdit, onDelete }) {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'done':
        return 'bg-emerald-950/50 border-emerald-800/80 text-emerald-400';
      case 'in_progress':
        return 'bg-amber-950/50 border-amber-800/80 text-amber-400';
      default:
        return 'bg-blue-950/50 border-blue-800/80 text-blue-400';
    }
  };

  const formatStatus = (status) => {
    if (status === 'in_progress') return 'In Progress';
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'To Do';
  };

  const formattedDate = task.due_date ? new Date(task.due_date).toLocaleDateString() : null;

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-blue-400 transition-colors">
            {task.title}
          </h3>
          <button
            onClick={() => onCycleStatus(task)}
            title="Click to change status"
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeStyle(task.status)} hover:scale-105 transition-transform flex items-center gap-1.5 whitespace-nowrap`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {formatStatus(task.status)}
          </button>
        </div>

        <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
          {task.description || <span className="italic text-slate-600">No description provided</span>}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3 overflow-hidden">
          {task.category && (
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium truncate">
              <i className="fas fa-tag text-[10px] mr-1 text-slate-500"></i>
              {task.category}
            </span>
          )}
          {formattedDate && (
            <span className="text-slate-400">
              <i className="far fa-calendar mr-1 text-slate-500"></i>
              {formattedDate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="text-slate-400 hover:text-blue-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <i className="fas fa-pen"></i>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
}