import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../../api/api';

function setMeta(property, content) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function PublicProfile() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    apiGet(`/therapists/${slug}`)
      .then((data) => {
        setProfile(data);
        document.title = `${data.name} | Unfazed`;
        setMeta('og:title', `${data.name} | Unfazed`);
        setMeta('og:description', data.bio || 'Therapist on Unfazed');
      })
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <h1 style={{ padding: 32 }}>Profile not found</h1>;
  if (!profile) return <p style={{ padding: 32 }}>Loading...</p>;

  return (
    <div className="profile">
      <section className="hero">
        <h1>{profile.name}</h1>
        <p>{profile.languages.join(' • ')}</p>
      </section>

      <section>
        <h2>About</h2>
        <p>{profile.bio || 'No bio added yet.'}</p>
      </section>

      <section>
        <h2>Specializations</h2>
        <div className="cards">
          {profile.specializations.map((s) => (
            <div key={s} className="service-card">{s}</div>
          ))}
        </div>
      </section>
    </div>
  );
}