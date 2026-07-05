import { useState,useEffect} from 'react';
import {useParams,Link} from 'react-router-dom'
import axiosInstance from '../api/axiosInstance';

const BoardList=()=>{
    const {workspaceId}=useParams()
    const [boards,setBoards]=useState([])
    const [newBoardName, setNewBoardName] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        fetchBoards();
    },[workspaceId]);
    const fetchBoards=async()=>{
        try {
            const response=await axiosInstance.get(`/workspaces/${workspaceId}/boards`);
            setBoards(response.data.boards);
        } catch (err) {
            console.error('Failed to fetch boards:', err);
        }finally {
      setLoading(false);
    }
    }

const handleCreateBoard=async(e)=>{
    e.preventDefault();
    try {
        await axiosInstance.post(`/workspaces/${workspaceId}/boards`, { name: newBoardName });
      setNewBoardName('');
      fetchBoards();
    } catch (err) {
        console.error('Failed to create board:', err);
    }
}

if (loading) return <div>Loading boards...</div>;
return(
    <div>
        <Link to="/dashboard">← Back to Dashboard</Link>
        <h1>Boards</h1>
        <form onSubmit={handleCreateBoard}>
            <input
            value={newBoardName}
            onChange={(e)=>setNewBoardName(e.target.value)}
            placeholder="New board name"
            required
            />
            <button type="submit">
                Create Board
            </button>
        </form>
        <ul>
            {boards.map((board) => (
          <li key={board._id}>
            <Link to={`/workspace/${workspaceId}/board/${board._id}`}>{board.name}</Link>
          </li>
        ))}
        </ul>
    </div>
)
};
export default BoardList

