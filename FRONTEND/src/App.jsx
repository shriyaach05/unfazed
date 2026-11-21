import { useEffect, useState } from 'react';
import { apiGet } from './api/api';

export default function App() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    apiGet('/health')
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('backend unreachable'));
  }, []);

  return <h1>Backend status: {status}</h1>;
}