'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestLogin() {
  const router = useRouter();
  const [room, setRoom] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!room || !phone) {
      setError('Please enter room number and phone');
      return;
    }

    setError('');
    setLoading(true);

    try {
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
        setLoading(false);
        return;
      }

      localStorage.setItem('guest_token', data.token);
      localStorage.setItem('guest_user', JSON.stringify(data.guest));

      router.push('/guest/dashboard');
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <img src="/logo.png" alt="HotelSuite" style={styles.logo} />

        <h2 style={styles.title}>Welcome Guest 👋</h2>
        <p style={styles.subtitle}>Login to request services</p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          placeholder="Room Number"
          value={room}
          onChange={e => setRoom(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Please wait…' : 'Continue'}
        </button>

        <p style={styles.footer}>
          Powered by <b>HotelSuite</b>
        </p>
      </div>
    </div>
  );
}
