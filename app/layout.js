import './globals.css';

export const metadata = {
  title: 'HotelSuite',
  description: 'Smart Guest & Staff Service Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
