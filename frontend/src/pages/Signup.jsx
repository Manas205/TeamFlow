import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/signup', { name, email, password });
      navigate('/login'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12"><form className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
      <div><p className="text-sm font-semibold text-indigo-600">Start collaborating</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">Create your account</h2><p className="mt-2 text-sm text-slate-500">Set up a workspace and bring your team together.</p></div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
      <label className="block text-sm font-medium text-slate-700">Name<input className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <label className="block text-sm font-medium text-slate-700">Email<input className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label className="block text-sm font-medium text-slate-700">Password<input className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
      <button className="min-h-11 w-full rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100" type="submit">Create account</button>
    </form></main>
  );
};

export default Signup;
