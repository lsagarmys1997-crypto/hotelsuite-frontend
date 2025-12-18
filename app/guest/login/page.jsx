'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestLogin() {
  const router = useRouter();
  const [room, setRoom] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    const res = await fetch(
      'https://hotelsuite-backend.onrender.com/api/guest/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_number: room,
          phone
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Login failed');
      return;
    }

    localStorage.setItem('guest_token', data.token);
    localStorage.setItem('guest_user', JSON.stringify(data.guest));

    router.push('/guest/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Guest Login</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <input
          placeholder="Room Number"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f4f6f8'
  },
  card: {
    background: '#fff',
    padding: 25,
    width: 300,
    borderRadius: 10,
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }
};
