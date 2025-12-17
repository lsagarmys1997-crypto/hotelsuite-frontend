'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('staff_token');
    const userData = localStorage.getItem('staff_user');

    // 🔐 Protect route
    if (!token || !userData) {
      router.push('/staff/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) {
    return <p style={{ padding: 20 }}>Loading dashboard...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Staff Dashboard</h1>

      <div style={styles.card}>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Department:</b> {user.department}</p>
        <p><b>Role:</b> {user.role}</p>
      </div>

      <button
        onClick={() => {
          localStorage.clear();
          router.push('/staff/login');
        }}
        style={styles.logout}
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
  card: {
    background: '#f4f4f4',
    padding: 20,
    borderRadius: 6,
    maxWidth: 400
  },
  logout: {
    marginTop: 20,
    padding: 10,
    cursor: 'pointer'
  }
};
