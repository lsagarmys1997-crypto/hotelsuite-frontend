'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
      localStorage.setItem('guest', JSON.stringify(data.guest));

      router.push('/guest/dashboard');
    } catch (err) {
      setError('Server error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="HotelSuite"
            width={80}
            height={80}
          />
        </div>

        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Guest Services
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Access hotel services from your room
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Room Number"
            value={room}
            onChange={e => setRoom(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Welcome! Log in to get started with our services
        </p>
      </div>
    </div>
  );
}
