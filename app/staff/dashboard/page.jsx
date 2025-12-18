'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/staff/login');
      return;
    }

    setUser(JSON.parse(userData));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/tickets`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTickets(data.tickets || []));
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/staff/tickets/${id}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );

    window.location.reload();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Staff Dashboard</h1>

      {user && (
        <div style={{ background: '#eef', padding: '10px', width: '300px' }}>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Department:</b> {user.department}</p>
          <p><b>Role:</b> {user.role}</p>
        </div>
      )}

      <h2>Open Tickets</h2>

      {tickets.length === 0 && <p>No open tickets 🎉</p>}

      {tickets.map(ticket => (
        <div
          key={ticket.id}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '10px'
          }}
        >
          <p><b>Room:</b> {ticket.room_number || '-'}</p>
          <p><b>Guest:</b> {ticket.guest_name || '-'}</p>
          <p><b>Title:</b> {ticket.title}</p>
          <p><b>Description:</b> {ticket.description}</p>
          <p><b>Status:</b> {ticket.status}</p>
          <p><b>Priority:</b> {ticket.priority}</p>

          {ticket.status !== 'closed' && (
            <div style={{ marginTop: '10px' }}>
              <button onClick={() => updateStatus(ticket.id, 'in_progress')}>
                In-Progress
              </button>{' '}
              <button onClick={() => updateStatus(ticket.id, 'closed')}>
                Close
              </button>{' '}
              <button onClick={() => updateStatus(ticket.id, 'not_in_room')}>
                Not in Room
              </button>{' '}
              <button onClick={() =>
                updateStatus(ticket.id, 'guest_not_responding')
              }>
                Guest Not Responding
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => {
          localStorage.clear();
          router.push('/staff/login');
        }}
      >
        Logout
      </button>
    </div>
  );
}
