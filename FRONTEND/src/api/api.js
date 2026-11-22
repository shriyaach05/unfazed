const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.errors?.[0]?.msg || 'Something went wrong');
  }
  return data;
}

export const apiGet = (path) => request(path);
export const apiPost = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });
export const apiPut = (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) });