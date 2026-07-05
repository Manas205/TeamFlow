import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import {Link} from 'react-router-dom'
const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

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
    </div>
  );
};

export default Dashboard;