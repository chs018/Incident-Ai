/**
 * Supabase Server Client — AI Incident Commander
 *
 * Safe client utility for server components, server actions, and API routes.
 * Returns null if environment variables are missing, enabling our Hybrid Fallback pattern.
 */

import { createServerClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    });
  } catch (error) {
    console.error('[Supabase] Failed to initialize server client:', error);
    return null;
  }
}

/**
 * Direct service-role or anon client for API routes where cookies aren't required
 */
export function getSupabaseDirectClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
  } catch (error) {
    return null;
  }
}
