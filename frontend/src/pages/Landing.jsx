import {Link,Navigate} from 'react-router-dom'
import {useAuth} from '../context/authContext'
const Landing =()=>{
    const {user}=useAuth()
    if(user) return <Navigate to="/dashboard" replace/>
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16"><section className="w-full max-w-2xl text-center"><div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">T</div><p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-600">TeamFlow</p><h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl">Keep your team moving forward.</h1><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">Real-time collaborative Kanban boards for planning work, sharing progress, and delivering together.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100" to="/signup">Get started</Link><Link className="rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100" to="/login">Log in</Link></div></section></main>;
};
export default Landing
