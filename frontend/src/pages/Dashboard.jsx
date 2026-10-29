import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/authContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const [inviteEmail, setInviteEmail] = useState({});

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await axiosInstance.get('/workspaces');
      setWorkspaces(response.data.workspaces);
    } catch (err) {
      console.error('Failed to fetch workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/workspaces', { name: newWorkspaceName });
      setNewWorkspaceName('');
      fetchWorkspaces();
    } catch (err) {
      console.error('Failed to create workspace:', err);
    }
  };

  const handleInvite = async (e, workspaceId) => {
    e.preventDefault();
    const email = inviteEmail[workspaceId];
    if (!email) return;
    try {
      await axiosInstance.post(`/workspaces/${workspaceId}/invite`, { email });
      setInviteEmail((prev) => ({ ...prev, [workspaceId]: '' }));
      alert('Member invited successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to invite member');
    }
  };

  if (loading) return <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center px-6 text-sm text-slate-500">Loading workspaces...</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-600">Workspace overview</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome, {user?.name}</h1>
          <p className="mt-2 text-sm text-slate-500">Manage your team spaces and keep projects moving.</p>
        </div>
        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100" onClick={logout}>Log out</button>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5"><h2 className="text-lg font-semibold text-slate-900">Create a workspace</h2><p className="mt-1 text-sm text-slate-500">Start a focused space for a team, project, or initiative.</p></div>
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleCreateWorkspace}>
          <input className="min-h-10 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" value={newWorkspaceName} onChange={(e) => setNewWorkspaceName(e.target.value)} placeholder="e.g. Product design" required />
          <button className="min-h-10 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100" type="submit">Create workspace</button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold text-slate-900">Your workspaces</h2><p className="mt-1 text-sm text-slate-500">Choose a workspace to view its boards.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{workspaces.length} total</span></div>
        {workspaces.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><h3 className="font-semibold text-slate-900">No workspaces yet</h3><p className="mt-1 text-sm text-slate-500">Create your first workspace above to get started.</p></div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {workspaces.map((ws) => (
              <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md" key={ws._id}>
                <div className="flex items-start justify-between gap-4"><Link className="min-w-0" to={`/workspace/${ws._id}`}><span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 font-semibold text-indigo-700">{ws.name.charAt(0).toUpperCase()}</span><span className="block truncate text-base font-semibold text-slate-900">{ws.name}</span><span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-400">{ws.role}</span></Link><Link className="text-sm font-semibold text-indigo-600 hover:text-indigo-700" to={`/workspace/${ws._id}`}>Open</Link></div>
                {ws.role === 'owner' && <form className="mt-5 flex gap-2 border-t border-slate-100 pt-4" onSubmit={(e) => handleInvite(e, ws._id)}><input className="min-h-9 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-xs outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" value={inviteEmail[ws._id] || ''} onChange={(e) => setInviteEmail((prev) => ({ ...prev, [ws._id]: e.target.value }))} placeholder="Invite by email" /><button className="rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100" type="submit">Invite</button></form>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
