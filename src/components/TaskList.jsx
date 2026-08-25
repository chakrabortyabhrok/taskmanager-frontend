
import TaskCard from './TaskCard';

export default function TaskList({ tasks, loading, onCycleStatus, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-slate-800 rounded w-2/3"></div>
              <div className="h-5 bg-slate-800 rounded-full w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-800 rounded w-full"></div>
              <div className="h-3 bg-slate-800 rounded w-4/5"></div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 bg-slate-800 rounded w-1/3"></div>
              <div className="h-6 bg-slate-800 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl">
        <i className="fas fa-inbox text-4xl mb-3 text-slate-600"></i>
        <p className="text-base font-medium">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onCycleStatus={onCycleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}