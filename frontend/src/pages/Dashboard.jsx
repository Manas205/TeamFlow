import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/authContext';
import {Link} from 'react-router-dom'


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
      fetchWorkspaces(); // refetch to show the new one
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
    alert('Member invited successfully'); // simple feedback, given timeline
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to invite member');
  }
};
  if (loading) return <div>Loading workspaces...</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>

      <h2>Your Workspaces</h2>
      <form onSubmit={handleCreateWorkspace}>
        <input
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          placeholder="New workspace name"
          required
        />
        <button type="submit">Create</button>
      </form>

      <ul>
        {workspaces.map((ws) => (
    <li key={ws._id}>
      <Link to={`/workspace/${ws._id}`}>{ws.name}</Link> ({ws.role})
    </li>
  ))}
      </ul>
      <ul>
  {workspaces.map((ws) => (
    <li key={ws._id}>
      <Link to={`/workspace/${ws._id}`}>{ws.name}</Link> ({ws.role})
      {ws.role === 'owner' && (
        <form onSubmit={(e) => handleInvite(e, ws._id)} style={{ display: 'inline', marginLeft: '12px' }}>
          <input
            value={inviteEmail[ws._id] || ''}
            onChange={(e) => setInviteEmail((prev) => ({ ...prev, [ws._id]: e.target.value }))}
            placeholder="Invite by email"
          />
          <button type="submit">Invite</button>
        </form>
      )}
    </li>
  ))}
</ul>
    </div>
  );
};

export default Dashboard;