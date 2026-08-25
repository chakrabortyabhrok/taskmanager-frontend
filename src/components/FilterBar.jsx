
export default function FilterBar({ search, setSearch, status, setStatus, category, setCategory, onRefresh }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center shadow-sm">
      <div className="flex-1 relative">
        <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks by title..."
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Filter category..."
          className="bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder-slate-500 rounded-xl px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={onRefresh}
          title="Refresh Tasks"
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-2.5 rounded-xl transition-colors"
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
  );
}