'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GuestDashboard() {
  const router = useRouter();
  const [guest, setGuest] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('guest_token');
    const user = localStorage.getItem('guest_user');

    if (!token || !user) {
      router.push('/guest/login');
      return;
    }

    setGuest(JSON.parse(user));

    fetch('https://hotelsuite-backend.onrender.com/api/guest/tickets', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Guest Dashboard</h1>

      {guest && (
        <div>
          <p><b>Name:</b> {guest.name}</p>
          <p><b>Room:</b> {guest.room_number}</p>
        </div>
      )}

      <h2>Your Tickets</h2>

      {tickets.map(t => (
        <div key={t.id} style={{ border: '1px solid #ccc', padding: 10 }}>
          <p><b>Title:</b> {t.title}</p>
          <p><b>Status:</b> {t.status}</p>
        </div>
      ))}

      <button onClick={() => {
        localStorage.clear();
        router.push('/guest/login');
      }}>
        Logout
      </button>
    </div>
  );
}
