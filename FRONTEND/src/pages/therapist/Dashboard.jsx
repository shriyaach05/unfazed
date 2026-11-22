import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { apiGet, apiPut } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { therapist, logout } = useAuth();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!therapist) return;
    apiGet('/therapists/me').then((data) =>
      setForm({
        name: data.name,
        bio: data.bio,
        specializations: data.specializations.join(', '),
        languages: data.languages.join(', '),
      })
    );
  }, [therapist]);

  // Protected route: nobody logged in -> go to login
  if (!therapist) return <Navigate to="/login" />;
  if (!form) return <p>Loading...</p>;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // "Anxiety, Stress" -> ["Anxiety", "Stress"]
  const toList = (text) => text.split(',').map((s) => s.trim()).filter(Boolean);

  async function handleSave(e) {
    e.preventDefault();
    try {
      await apiPut('/therapists/me', {
        name: form.name,
        bio: form.bio,
        specializations: toList(form.specializations),
        languages: toList(form.languages),
      });
      setMessage('Saved!');
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleSave} className="card">
        <h1>Your profile</h1>
        <p>
          Your public link: <Link to={`/${therapist.slug}`}>/{therapist.slug}</Link>
        </p>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <textarea name="bio" placeholder="About you" rows="4" value={form.bio} onChange={handleChange} />
        <input name="specializations" placeholder="Specializations (comma separated)" value={form.specializations} onChange={handleChange} />
        <input name="languages" placeholder="Languages (comma separated)" value={form.languages} onChange={handleChange} />
        <button type="submit">Save</button>
        {message && <p>{message}</p>}
        <button type="button" onClick={logout}>Log out</button>
      </form>
    </div>
  );
}