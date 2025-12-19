'use client';

import { useEffect, useState } from 'react';
import {
  BedDouble,
  Utensils,
  Wrench,
  ConciergeBell
} from 'lucide-react';

export default function GuestDashboard() {
  const [tab, setTab] = useState('services');
  const [guest, setGuest] = useState({ name: 'Guest', room_number: '—' });
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const g = localStorage.getItem('guest_user');
    if (g) setGuest(JSON.parse(g));

    const token = localStorage.getItem('guest_token');
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/guest/tickets`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          HS
        </div>

        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome, {guest.name} 👋
          </h1>
          <p className="text-sm text-gray-500">
            Room {guest.room_number}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl shadow-sm overflow-hidden mb-6">
        <TabButton active={tab === 'services'} onClick={() => setTab('services')}>
          Services
        </TabButton>
        <TabButton active={tab === 'requests'} onClick={() => setTab('requests')}>
          Requests
        </TabButton>
        <TabButton active={tab === 'about'} onClick={() => setTab('about')}>
          About
        </TabButton>
      </div>

      {/* Content */}
      {tab === 'services' && <Services />}
      {tab === 'requests' && <Requests tickets={tickets} />}
      {tab === 'about' && <About />}
    </div>
  );
}

/* ---------- Components ---------- */

function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-medium transition
        ${active
          ? 'bg-indigo-600 text-white'
          : 'bg-white text-gray-600 hover:bg-gray-50'}
      `}
    >
      {children}
    </button>
  );
}

function Services() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ServiceCard icon={<BedDouble />} title="Housekeeping" desc="Cleaning, towels, water" />
      <ServiceCard icon={<Utensils />} title="Room Service" desc="Food & beverages" />
      <ServiceCard icon={<Wrench />} title="Maintenance" desc="AC, lights, TV" />
      <ServiceCard icon={<ConciergeBell />} title="Concierge" desc="Travel & assistance" />
    </div>
  );
}

function ServiceCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer">
      <div className="text-indigo-600 mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

function Requests({ tickets }) {
  if (tickets.length === 0) {
    return <p className="text-gray-500 text-sm">No requests yet</p>;
  }

  return (
    <div className="space-y-3">
      {tickets.map(t => (
        <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-gray-500 capitalize">
              {t.status.replace('_', ' ')}
            </p>
          </div>
          <StatusBadge status={t.status} />
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    open: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    closed: 'bg-green-100 text-green-700',
    guest_not_in_room: 'bg-red-100 text-red-700'
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${colors[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function About() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md text-sm text-gray-600">
      <h3 className="font-semibold text-gray-800 mb-2">About HotelSuite</h3>
      <p>
        HotelSuite is an all-in-one SaaS platform built for hotels and resorts to simplify guest interactions and streamline internal operations.
        It unifies guest-facing services—such as service requests, in-stay chat, and targeted promotions—with back-office operations including task ticketing, staff assignment, and real-time management dashboards.
        HotelSuite helps properties deliver faster service, reduce operational friction, and unlock new revenue opportunities—all from a single, intuitive system.
      </p>
      <p className="mt-2">
        For Guests
        HotelSuite makes your stay effortless.
        From the moment you check in, HotelSuite lets you connect with the hotel instantly—no calls, no waiting, no confusion.
      </p>
    </div>
  );
}
