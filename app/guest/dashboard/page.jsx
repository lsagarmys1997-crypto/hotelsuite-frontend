'use client';

import { useEffect, useState } from 'react';
import {
  BedDouble,
  Utensils,
  Wrench,
  ConciergeBell
} from 'lucide-react';

type Ticket = {
  id: string;
  title: string;
  status: string;
};

export default function GuestDashboard() {
  const [guestName, setGuestName] = useState('Guest');
  const [roomNumber, setRoomNumber] = useState('—');
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Load guest info from localStorage
    const guest = localStorage.getItem('guest');
    if (guest) {
      const g = JSON.parse(guest);
      setGuestName(g.name || 'Guest');
      setRoomNumber(g.room_number || '—');
    }

    // Fetch tickets
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/guest/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTickets(data.tickets || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, {guestName} 👋
        </h1>
        <p className="text-gray-500">Room {roomNumber}</p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <ServiceCard
          icon={<BedDouble size={28} />}
          title="Housekeeping"
          desc="Cleaning, towels, water"
        />
        <ServiceCard
          icon={<Utensils size={28} />}
          title="Room Service"
          desc="Food & beverages"
        />
        <ServiceCard
          icon={<Wrench size={28} />}
          title="Maintenance"
          desc="AC, lights, TV"
        />
        <ServiceCard
          icon={<ConciergeBell size={28} />}
          title="Concierge"
          desc="Travel & assistance"
        />
      </div>

      {/* My Requests */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          My Requests
        </h2>

        {tickets.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No requests yet
          </p>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {ticket.title}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {ticket.status.replace('_', ' ')}
                  </p>
                </div>

                <StatusBadge status={ticket.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function ServiceCard({
  icon,
  title,
  desc
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm active:scale-95 transition">
      <div className="text-green-600 mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800">
        {title}
      </h3>
      <p className="text-sm text-gray-500">
        {desc}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    closed: 'bg-green-100 text-green-700',
    guest_not_in_room: 'bg-red-100 text-red-700'
  };

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full ${
        map[status] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {status.replace('_', ' ')}
    </span>
  );
}
