'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function GuestDashboard() {
  const [activeTab, setActiveTab] = useState('services');
  const [guest, setGuest] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  /* ================= LOAD TICKETS ================= */
  const loadTickets = async () => {
    const token = localStorage.getItem('guest_token');
    if (!token) return;

    try {
      const res = await fetch(
        'https://hotelsuite-backend.onrender.com/api/guest/tickets',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch {
      setTickets([]);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    const g = localStorage.getItem('guest_user');
    if (g) setGuest(JSON.parse(g));
    loadTickets();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem('guest_token');
    localStorage.removeItem('guest_user');
    window.location.href = '/guest/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}
      <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="HotelSuite"
            width={40}
            height={40}
            className="rounded"
            priority
          />
          <div>
            <p className="font-semibold text-gray-800">HotelSuite</p>
            <p className="text-sm text-gray-700">
              {guest?.name ? `Welcome, ${guest.name}` : 'Welcome, Guest'}
            </p>
            <p className="text-xs text-gray-500">
              Room {guest?.room_number || '—'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Logout
        </button>
      </header>

      {/* ================= TABS ================= */}
      <nav className="flex bg-white border-b">
        <Tab label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
        <Tab label="My Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
        <Tab label="About" active={activeTab === 'about'} onClick={() => setActiveTab('about')} />
      </nav>

      {/* ================= CONTENT ================= */}
      <main className="p-4">
        {activeTab === 'services' && (
          <Services
            onSelect={(service) => {
              setSelectedService(service);
              setShowModal(true);
            }}
          />
        )}

        {activeTab === 'requests' && <Requests tickets={tickets} />}
        {activeTab === 'about' && <About />}
      </main>

      {/* ================= REQUEST MODAL ================= */}
      {showModal && selectedService && (
        <RequestModal
          service={selectedService}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            loadTickets();              // 🔥 refresh tickets
            setActiveTab('requests');   // 🔥 switch tab
            setShowModal(false);        // 🔥 close modal
          }}
        />
      )}
    </div>
  );
}

/* ================= TAB ================= */
function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 text-sm font-medium ${
        active
          ? 'text-indigo-600 border-b-2 border-indigo-600'
          : 'text-gray-500'
      }`}
    >
      {label}
    </button>
  );
}

/* ================= SERVICES ================= */
function Services({ onSelect }) {
  const services = [
    { title: 'Housekeeping', desc: 'Cleaning, towels, water', department: 'housekeeping', icon: '🧹' },
    { title: 'Room Service', desc: 'Food & beverages', department: 'room_service', icon: '🍽️' },
    { title: 'Maintenance', desc: 'AC, TV, lights', department: 'maintenance', icon: '🛠️' },
    { title: 'Concierge', desc: 'Travel & assistance', department: 'concierge', icon: '🛎️' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {services.map(s => (
        <button
          key={s.title}
          onClick={() => onSelect(s)}
          className="bg-white rounded-2xl p-4 shadow hover:shadow-md active:scale-95 transition text-left"
        >
          <div className="text-3xl mb-2">{s.icon}</div>
          <h3 className="font-semibold text-gray-800">{s.title}</h3>
          <p className="text-sm text-gray-500">{s.desc}</p>
        </button>
      ))}
    </div>
  );
}

/* ================= REQUESTS ================= */
function Requests({ tickets }) {
  if (tickets.length === 0) {
    return <p className="text-sm text-gray-500">No requests raised yet.</p>;
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

/* ================= MODAL ================= */
function RequestModal({ service, onClose, onSuccess }) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('guest_token');

      const res = await fetch(
        'https://hotelsuite-backend.onrender.com/api/guest/tickets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: service.title,
            description,
            department: service.department,
            priority: 'normal'
          })
        }
      );

      if (!res.ok) throw new Error('Failed to raise request');

      setDescription('');
      onSuccess();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-lg">
        <h2 className="font-semibold text-gray-800 mb-2">
          {service.title} Request
        </h2>

        <textarea
          rows={4}
          placeholder="Describe your request"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="text-sm text-gray-600">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!description || loading}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= ABOUT ================= */
function About() {
  return (
    <div className="bg-white rounded-xl p-5 shadow">
      <h2 className="font-semibold text-gray-800 mb-2">
        About HotelSuite
      </h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        HotelSuite lets you request housekeeping, room service,
        maintenance, and concierge support seamlessly during your stay.
      </p>
    </div>
  );
}
