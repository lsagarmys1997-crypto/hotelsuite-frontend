'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    const res = await fetch(
      'https://hotelsuite-backend.onrender.com/api/guest/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Login failed');
      return;
    }

    // ✅ Save guest token
    localStorage.setItem('guest_token', data.token);
    localStorage.setItem('guest_user', JSON.stringify(data.guest));

    router.push('/guest/dashboard');
  };

  return (
    <div style={{ marginTop: 100, textAlign: 'center' }}>
      <h2>Guest Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
