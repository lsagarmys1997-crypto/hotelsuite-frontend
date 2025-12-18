'use client';

import { useEffect, useState } from 'react';
import {
  BedDouble,
  Utensils,
  Wrench,
  ConciergeBell,
  X
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function GuestDashboard() {
  const [guest, setGuest] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('services');

  const [modal, setModal] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  /* ---------- Load Guest & Tickets ---------- */
  useEffect(() => {
    const g = localStorage.getItem('guest_user');
    const token = localStorage.getItem('guest_token');

    if (g) setGuest(JSON.parse(g));
    if (!token) return;

    fetch(`${API}/api/guest/tickets`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []))
      .catch(() => {});
  }, []);

  /* ---------- Create Ticket ---------- */
  const submitRequest = async () => {
    const token = localStorage.getItem('guest_token');

    await fetch(`${API}/api/guest/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description: desc,
        department: modal
      })
    });

    setModal(null);
    setTitle('');
    setDesc('');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 p-4">
      {/* Header */}
      <header className="bg-white rounded-2xl p-4 shadow mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">
            Welcome, {guest?.name || 'Guest'} 👋
          </h1>
          <p className="text-sm text-gray-500">
            Room {guest?.room_number || '—'}
          </p>
        </div>
        <img src="/logo.png" className="w-10" />
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {['services', 'requests', 'about'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === t
                ? 'bg-indigo-600 text-white'
                : 'bg-white shadow'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* SERVICES */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-2 gap-4">
          <Service
            icon={<BedDouble />}
            title="Housekeeping"
            desc="Cleaning, towels, water"
            onClick={() => setModal('housekeeping')}
          />
          <Service
            icon={<Utensils />}
            title="Room Service"
            desc="Food & beverages"
            onClick={() => setModal('room_service')}
          />
          <Service
            icon={<Wrench />}
            title="Maintenance"
            desc="AC, lights, TV"
            onClick={() => setModal('maintenance')}
          />
          <Service
            icon={<ConciergeBell />}
            title="Concierge"
            desc="Travel & assistance"
            onClick={() => setModal('concierge')}
          />
        </div>
      )}

      {/* REQUESTS */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <p className="text-gray-500">No requests yet</p>
          ) : (
            tickets.map(t => (
              <div
                key={t.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between"
              >
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-sm text-gray-500">
                    {t.description}
                  </p>
                </div>
                <Status status={t.status} />
              </div>
            ))
          )}
        </div>
      )}

      {/* ABOUT */}
      {activeTab === 'about' && (
        <div className="bg-white p-5 rounded-xl shadow text-gray-600">
          <h2 className="font-semibold mb-2">About HotelSuite</h2>
          <p>
            Request housekeeping, maintenance, food & concierge
            services directly from your room.
          </p>
        </div>
      )}

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-2xl w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold capitalize">
                {modal.replace('_', ' ')}
              </h3>
              <X onClick={() => setModal(null)} />
            </div>

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              className="w-full border p-2 rounded mb-3"
              placeholder="Describe your request"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />

            <button
              onClick={submitRequest}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Components ---------- */

function Service({ icon, title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-2xl shadow hover:scale-105 transition cursor-pointer"
    >
      <div className="text-indigo-600 mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

function Status({ status }) {
  const map = {
    open: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    closed: 'bg-green-100 text-green-700'
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full ${
        map[status] || 'bg-gray-200'
      }`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
