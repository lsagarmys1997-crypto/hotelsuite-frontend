'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const [staff, setStaff] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD STAFF + TICKETS ================= */
  const loadTickets = async () => {
    const token = localStorage.getItem('staff_token');
    if (!token) return;

    try {
      const res = await fetch(
        'https://hotelsuite-backend.onrender.com/api/staff/tickets',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = localStorage.getItem('staff_user');
    if (!s) {
      router.push('/staff/login');
      return;
    }

    setStaff(JSON.parse(s));
    loadTickets();
  }, []);

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem('staff_token');
    localStorage.removeItem('staff_user');
    router.push('/staff/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ================= HEADER ================= */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
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
            <p className="text-xs text-gray-500">
              Staff Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {staff?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {staff?.role} · {staff?.department}
            </p>
          </div>

          <button
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Active Tickets
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-500">No tickets available</p>
        ) : (
          <div className="space-y-4">
            {tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onUpdate={loadTickets}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= TICKET CARD ================= */
function TicketCard({ ticket, onUpdate }) {
  const updateStatus = async (status) => {
    const token = localStorage.getItem('staff_token');
    if (!token) return;

    await fetch(
      `https://hotelsuite-backend.onrender.com/api/staff/tickets/${ticket.id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );

    onUpdate();
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left */}
      <div>
        <p className="font-semibold text-gray-800">
          {ticket.title}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          Room {ticket.room_number || '—'} · {ticket.department}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Guest: {ticket.guest_name || 'Guest'}
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <span className={`text-xs px-3 py-1 rounded-full ${statusColor(ticket.status)}`}>
          {ticket.status.replace('_', ' ')}
        </span>

        <div className="flex gap-2">
          <ActionButton
            label="In Progress"
            onClick={() => updateStatus('in_progress')}
          />
          <ActionButton
            label="Guest Not In Room"
            onClick={() => updateStatus('guest_not_in_room')}
          />
          <ActionButton
            label="Close"
            danger
            onClick={() => updateStatus('closed')}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= ACTION BUTTON ================= */
function ActionButton({ label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1 rounded-lg font-medium ${
        danger
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
      }`}
    >
      {label}
    </button>
  );
}

/* ================= STATUS COLOR ================= */
function statusColor(status) {
  switch (status) {
    case 'open':
      return 'bg-yellow-100 text-yellow-700';
    case 'in_progress':
      return 'bg-blue-100 text-blue-700';
    case 'closed':
      return 'bg-green-100 text-green-700';
    case 'guest_not_in_room':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}
