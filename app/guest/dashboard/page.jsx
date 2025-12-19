'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function GuestDashboard() {
  const [activeTab, setActiveTab] = useState('services');
  const [guest, setGuest] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const g = localStorage.getItem('guest_user');
    if (g) setGuest(JSON.parse(g));

    const token = localStorage.getItem('guest_token');
    if (!token) return;

    fetch('https://hotelsuite-backend.onrender.com/api/guest/tickets', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('guest_token');
    localStorage.removeItem('guest');
    window.location.href = '/guest/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HEADER ================= */}
      <div className="bg-white shadow px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="HotelSuite Logo"
            width={40}
            height={40}
            className="rounded"
            priority
          />
          <div>
            <p className="font-semibold text-gray-800 leading-tight">
              HotelSuite
            </p>
            <p className="text-xs text-gray-500">
              Room {guest?.room_number || '—'}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex justify-around bg-white border-b">
        <Tab
          label="Services"
          active={activeTab === 'services'}
          onClick={() => setActiveTab('services')}
        />
        <Tab
          label="My Requests"
          active={activeTab === 'requests'}
          onClick={() => setActiveTab('requests')}
        />
        <Tab
          label="About"
          active={activeTab === 'about'}
          onClick={() => setActiveTab('about')}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-4">
        {activeTab === 'services' && <Services />}
        {activeTab === 'requests' && <Requests tickets={tickets} />}
        {activeTab === 'about' && <About />}
      </div>
    </div>
  );
}

/* ---------- Tabs ---------- */
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`py-3 text-sm font-medium w-full ${
        active
          ? 'text-indigo-600 border-b-2 border-indigo-600'
          : 'text-gray-500'
      }`}
    >
      {label}
    </button>
  );
}

/* ---------- Services ---------- */
function Services() {
  const services = [
    { title: 'Housekeeping', desc: 'Cleaning, towels, water', icon: '🧹' },
    { title: 'Room Service', desc: 'Food & beverages', icon: '🍽️' },
    { title: 'Maintenance', desc: 'AC, TV, lights', icon: '🛠️' },
    { title: 'Concierge', desc: 'Travel & assistance', icon: '🛎️' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {services.map(s => (
        <div
          key={s.title}
          className="bg-white rounded-2xl p-4 shadow hover:shadow-md active:scale-95 transition cursor-pointer"
        >
          <div className="text-3xl mb-2">{s.icon}</div>
          <h3 className="font-semibold text-gray-800">{s.title}</h3>
          <p className="text-sm text-gray-500">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Requests ---------- */
function Requests({ tickets }) {
  if (tickets.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No requests raised yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map(t => (
        <div
          key={t.id}
          className="bg-white rounded-xl p-4 shadow flex justify-between items-center"
        >
          <div>
            <p className="font-medium text-gray-800">{t.title}</p>
            <p className="text-xs text-gray-500 capitalize">
              {t.status.replace('_', ' ')}
            </p>
          </div>

          <span className={`text-xs px-3 py-1 rounded-full ${statusColor(t.status)}`}>
            {t.status.replace('_', ' ')}
          </span>
        </div>
      ))}
    </div>
  );
}

function statusColor(status) {
  switch (status) {
    case 'open':
      return 'bg-yellow-100 text-yellow-700';
    case 'in_progress':
      return 'bg-blue-100 text-blue-700';
    case 'closed':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-200 text-gray-600';
  }
}

/* ---------- About ---------- */
function About() {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <h2 className="font-semibold text-gray-800 mb-2">
        Welcome 👋
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        Your stay, made simple.
        Request services, chat with staff, and explore exclusive offers—all in one place.
      </p>
      <p className="text-sm text-gray-600 mt-3">
        For emergencies, please contact reception immediately.
      </p>
    </div>
  );
}
