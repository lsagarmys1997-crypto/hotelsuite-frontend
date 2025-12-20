'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function StaffLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        'https://hotelsuite-backend.onrender.com/api/staff/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // ✅ Save JWT
      localStorage.setItem('staff_token', data.token);
      localStorage.setItem('staff_user', JSON.stringify(data.user));

      router.push('/staff/dashboard');
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="HotelSuite Logo"
            width={56}
            height={56}
            className="rounded-lg"
            priority
          />
          <h1 className="mt-3 text-xl font-semibold text-gray-800">
            HotelSuite
          </h1>
          <p className="text-sm text-gray-500">
            Staff Portal
          </p>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
          Staff Login
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="staff@hotel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          Authorized hotel staff only
        </p>
      </div>
    </div>
  );
}
