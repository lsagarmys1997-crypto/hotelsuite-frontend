export const metadata = {
  title: 'HotelSuite',
  description: 'Hotel Management System'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
