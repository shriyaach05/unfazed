import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { saveLogin } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await apiPost('/auth/login', form);
      saveLogin(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="card">
        <h1>Welcome back</h1>
        {error && <p className="error">{error}</p>}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit">Log in</button>
        <p>New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}