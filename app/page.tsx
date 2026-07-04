import { redirect } from 'next/navigation';

/**
 * Root page — redirects to the dashboard.
 * When Clerk auth is added, this will redirect to /login if unauthenticated.
 */
export default function RootPage() {
  redirect('/dashboard');
}
