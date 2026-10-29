import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const BoardList = () => {
  const { workspaceId } = useParams();
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, [workspaceId]);

  const fetchBoards = async () => {
    try {
      const response = await axiosInstance.get(`/workspaces/${workspaceId}/boards`);
      setBoards(response.data.boards);
    } catch (err) {
      console.error('Failed to fetch boards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/workspaces/${workspaceId}/boards`, { name: newBoardName });
      setNewBoardName('');
      fetchBoards();
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  if (loading) return <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center px-6 text-sm text-slate-500">Loading boards...</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link className="inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700" to="/dashboard">← Back to Dashboard</Link>
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-sm font-medium text-indigo-600">Workspace boards</p><h1 className="text-3xl font-semibold tracking-tight text-slate-900">Boards</h1><p className="mt-2 text-sm text-slate-500">Open a board to plan, prioritize, and move work forward.</p></div><form className="flex w-full gap-2 sm:w-auto" onSubmit={handleCreateBoard}><input className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-56" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="New board name" required /><button className="min-h-10 whitespace-nowrap rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100" type="submit">Create board</button></form></header>
      {boards.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><h2 className="font-semibold text-slate-900">No boards yet</h2><p className="mt-1 text-sm text-slate-500">Create a board above to start organizing work.</p></div> : <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{boards.map((board) => <li className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md" key={board._id}><Link className="block" to={`/workspace/${workspaceId}/board/${board._id}`}><span className="mb-8 block h-1 w-10 rounded-full bg-indigo-500" /><span className="block text-base font-semibold text-slate-900 group-hover:text-indigo-700">{board.name}</span><span className="mt-2 block text-sm text-slate-500">Open board <span aria-hidden="true">→</span></span></Link></li>)}</ul>}
    </div>
  );
};

export default BoardList;
