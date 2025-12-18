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
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-indigo-600">
            HotelSuite
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Guest Services Portal
          </p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Guest Login
        </h2>

        {error && (
          <p className="text-sm text-red-600 text-center mb-3">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Room Number"
            value={room}
            onChange={e => setRoom(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Scan QR code in your room to access services
        </p>
      </div>
    </div>
  );
}
