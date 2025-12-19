'use client';

import { useEffect, useState } from 'react';

export default function GuestDashboard() {
  const [activeTab, setActiveTab] = useState('services');
  const [guest, setGuest] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const g = localStorage.getItem('guest');
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome{guest?.name ? `, ${guest.name}` : ''} 👋
        </h1>
        <p className="text-sm text-gray-500">
          Room {guest?.room_number || '—'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-around bg-white border-b">
        <Tab label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
        <Tab label="My Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
        <Tab label="About" active={activeTab === 'about'} onClick={() => setActiveTab('about')} />
      </div>

      {/* Content */}
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
      className={`py-3 text-sm font-medium ${
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
          className="bg-white rounded-2xl p-4 shadow active:scale-95 transition"
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
        About Our Hotel
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        HotelSuite is an all-in-one SaaS platform built for hotels and resorts to simplify guest interactions and streamline internal operations. It unifies guest-facing services—such as service requests, in-stay chat, and targeted promotions—with back-office operations including task ticketing, staff assignment, and real-time management dashboards. HotelSuite helps properties deliver faster service, reduce operational friction, and unlock new revenue opportunities—all from a single, intuitive system.
      </p>
      <p className="text-sm text-gray-600 mt-3">
        For emergencies, please contact reception immediately.
      </p>
    </div>
  );
}
