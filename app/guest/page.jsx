'use client';

import { useRouter } from 'next/navigation';

export default function GuestHome() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Our Resort 🌿</h1>

        <p style={styles.subtitle}>
          Scan • Login • Request Service
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/869/869636.png"
          alt="hotel"
          style={styles.image}
        />

        <button
          style={styles.button}
          onClick={() => router.push('/guest/login')}
        >
          Guest Login
        </button>

        <p style={styles.footer}>
          For in-room assistance & services
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2c3e50, #4ca1af)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    background: '#fff',
    padding: 30,
    borderRadius: 12,
    width: 320,
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  title: {
    marginBottom: 10
  },
  subtitle: {
    color: '#555',
    marginBottom: 20
  },
  image: {
    width: 100,
    marginBottom: 20
  },
  button: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    background: '#4ca1af',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  },
  footer: {
    marginTop: 15,
    fontSize: 12,
    color: '#777'
  }
};
