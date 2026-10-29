import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/authContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser's default full-page-reload form submit

    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { accessToken, user } = response.data;

      login(user, accessToken); // store in Context + axiosInstance's token variable
      navigate('/dashboard'); // redirect after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12"><form className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
      <div><p className="text-sm font-semibold text-indigo-600">Welcome back</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">Log in to TeamFlow</h2><p className="mt-2 text-sm text-slate-500">Continue managing your team’s work.</p></div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
      <input className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="min-h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100" type="submit">Log in</button>
    </form></main>
  );
};

export default Login;
