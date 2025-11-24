import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DevOps Todo App',
  description: 'Application d\'apprentissage DevOps avec CI/CD',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

