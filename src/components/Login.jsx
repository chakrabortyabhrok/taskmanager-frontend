import { useState } from "react";

export default function Login(username, password) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Fixed: added /api prefix
            const res = await fetch(`${API_BASE}/api/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Invalid username or password');
            }
            const data = await res.json();
            localStorage.setItem('access_token', data.access);
            setToken(data.access);
            showToast('Logged in successfully!');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

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

    return (
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
    )
    return (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <i className="fas fa-list-check text-blue-500"></i> Task Manager
                </h2>
                <p className="text-slate-400 text-sm mt-1">Sign in with Django API credentials</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Username
                    </label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Password
                    </label>
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
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                    {loading ? 'Connecting...' : 'Sign In'}
                </button>
            </form>
        </div>
    );

}







