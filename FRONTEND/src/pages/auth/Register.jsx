import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { saveLogin } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault(); // stops the browser from reloading the page
    setError('');
    try {
      const data = await apiPost('/auth/register', form);
      saveLogin(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="card">
        <h1>Create your practice page</h1>
        {error && <p className="error">{error}</p>}
        <input name="name" placeholder="Full name (e.g. Dr. Anita Sharma)" value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} />
        <button type="submit">Register</button>
        <p>Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}