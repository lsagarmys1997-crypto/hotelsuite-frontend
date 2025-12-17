'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('staff_token');
    const userData = localStorage.getItem('staff_user');

    if (!token || !userData) {
      router.push('/staff/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    fetchTickets(token);
  }, []);

  async function fetchTickets(token) {
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

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch tickets');
      }

      setTickets(data.tickets);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1>Staff Dashboard</h1>

      <div style={styles.userCard}>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Department:</b> {user.department}</p>
        <p><b>Role:</b> {user.role}</p>
      </div>

      <h2>Open Tickets</h2>

      {loading && <p>Loading tickets...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && tickets.length === 0 && (
        <p>No open tickets 🎉</p>
      )}

      {tickets.map(ticket => (
        <div key={ticket.id} style={styles.ticketCard}>
          <p><b>Room:</b> {ticket.room_number}</p>
          <p><b>Guest:</b> {ticket.guest_name || '—'}</p>
          <p><b>Title:</b> {ticket.title}</p>
          <p><b>Description:</b> {ticket.description}</p>
          <p><b>Status:</b> {ticket.status}</p>
          <p><b>Priority:</b> {ticket.priority}</p>
        </div>
      ))}

      <button
        style={styles.logout}
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

const styles = {
  container: {
    padding: 30,
    fontFamily: 'Arial'
  },
  userCard: {
    background: '#eef',
    padding: 15,
    borderRadius: 6,
    maxWidth: 400,
    marginBottom: 20
  },
  ticketCard: {
    border: '1px solid #ccc',
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    background: '#fafafa'
  },
  logout: {
    marginTop: 20,
    padding: 10,
    cursor: 'pointer'
  }
};
