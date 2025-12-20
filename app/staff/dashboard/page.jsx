'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('open');
  const [staff, setStaff] = useState(null);
  const [tickets, setTickets] = useState([]);

  /* ================= LOAD STAFF ================= */
  useEffect(() => {
    const s = localStorage.getItem('staff_user');
    if (s) setStaff(JSON.parse(s));

    // TEMP: UI demo tickets
    setTickets([
      {
        id: 1,
        room: '101',
        guest: 'Ravi Singh',
        department: 'Housekeeping',
        title: 'Towels needed',
        priority: 'normal',
        status: 'open'
      },
      {
        id: 2,
        room: '203',
        guest: 'Guest',
        department: 'Maintenance',
        title: 'AC not cooling',
        priority: 'high',
        status: 'open'
      }
    ]);
  }, []);

  const logout = () => {
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_user');
    window.location.href = '/staff/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="HotelSuite"
            width={42}
            height={42}
            className="rounded"
            priority
          />
          <div>
            <p className="font-semibold text-gray-800">HotelSuite</p>
            <p className="text-sm text-gray-500">
              {staff?.name || 'Staff'} • {staff?.department || 'Department'}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-sm font-medium text-red-600 hover:underline"
        >
          Logout
        </button>
      </header>

      {/* ================= TABS ================= */}
      <nav className="flex bg-white border-b">
        <Tab label="Open Tickets" active={activeTab === 'open'} onClick={() => setActiveTab('open')} />
        <Tab label="My Tickets" active={activeTab === 'my'} onClick={() => setActiveTab('my')} />
        <Tab label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>

      {/* ================= CONTENT ================= */}
      <main className="p-6">
        {activeTab === 'open' && <TicketList tickets={tickets} />}
        {activeTab === 'my' && <EmptyState text="No tickets assigned yet." />}
        {activeTab === 'profile' && <Profile staff={staff} />}
      </main>
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

/* ================= TICKET LIST ================= */
function TicketList({ tickets }) {
  if (tickets.length === 0) {
    return <EmptyState text="No open tickets." />;
  }

  return (
    <div className="space-y-4">
      {tickets.map(t => (
        <div
          key={t.id}
          className="bg-white rounded-xl p-5 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <p className="font-semibold text-gray-800">{t.title}</p>
            <p className="text-sm text-gray-500">
              Room {t.room} • {t.department}
            </p>
            <p className="text-xs text-gray-400">
              Guest: {t.guest}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={t.status} />
            <PriorityBadge priority={t.priority} />

            <button className="px-3 py-1 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================= BADGES ================= */
function StatusBadge({ status }) {
  const map = {
    open: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    closed: 'bg-green-100 text-green-700'
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${map[status]}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    high: 'bg-red-100 text-red-700',
    normal: 'bg-gray-200 text-gray-700'
  };

  return (
    <span className={`text-xs px-3 py-1 rounded-full ${map[priority]}`}>
      {priority}
    </span>
  );
}

/* ================= PROFILE ================= */
function Profile({ staff }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow max-w-md">
      <h2 className="font-semibold text-gray-800 mb-4">My Profile</h2>
      <p className="text-sm text-gray-600">Name: {staff?.name}</p>
      <p className="text-sm text-gray-600">Email: {staff?.email}</p>
      <p className="text-sm text-gray-600">Department: {staff?.department}</p>
      <p className="text-sm text-gray-600">Role: {staff?.role}</p>
    </div>
  );
}

/* ================= EMPTY ================= */
function EmptyState({ text }) {
  return (
    <p className="text-sm text-gray-500">{text}</p>
  );
}
