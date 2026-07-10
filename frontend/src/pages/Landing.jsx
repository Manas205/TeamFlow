import {Link,Navigate} from 'react-router-dom'
import {useAuth} from '../context/authContext'
const Landing =()=>{
    const {user}=useAuth()
    if(user) return <Navigate to="/dashboard" replace/>
    return(
         <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>TeamFlow</h1>
      <p>Real-time collaborative Kanban boards for your team.</p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
    );
};
export default Landing