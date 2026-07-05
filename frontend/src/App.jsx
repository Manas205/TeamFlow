// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import BoardList from './pages/BoardList';
import BoardDetail from './pages/BoardDetail';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
          } />
          <Route path="/workspace/:workspaceId" element={<ProtectedRoute><BoardList/></ProtectedRoute>}/>
          import BoardDetail from './pages/BoardDetail';
        <Route path="/workspace/:workspaceId/board/:boardId" element={<ProtectedRoute><BoardDetail /></ProtectedRoute>} />
      </Routes>
      

    </BrowserRouter>
  );
}

export default App;