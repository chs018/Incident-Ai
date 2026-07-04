import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: {
    default: 'AI Incident Commander',
    template: '%s | AI Incident Commander',
  },
  description:
    'Enterprise AI-powered incident management platform for SRE, DevOps, and Platform Engineering teams. Analyze, triage, and resolve production incidents faster with AI.',
  keywords: ['incident management', 'SRE', 'DevOps', 'AI', 'platform engineering', 'observability'],
  authors: [{ name: 'AI Incident Commander' }],
  robots: 'noindex, nofollow', // Enterprise app — not for indexing
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
