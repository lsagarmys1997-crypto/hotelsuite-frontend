import './globals.css';

export const metadata = {
  title: 'HotelSuite',
  description: 'Unified Hotel Service Platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
