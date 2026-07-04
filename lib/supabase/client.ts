/**
 * Supabase Browser Client — AI Incident Commander
 *
 * Safe client utility for browser components.
 * Returns null if environment variables are not configured, enabling our Hybrid Fallback pattern.
 */

import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseBrowserClient: SupabaseClient | null = null;
let directClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (supabaseBrowserClient) return supabaseBrowserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.info('[Supabase] NEXT_PUBLIC_SUPABASE_URL or ANON_KEY not found. Using local in-memory fallback store.');
    return null;
  }

  try {
    supabaseBrowserClient = createBrowserClient(url, key);
    return supabaseBrowserClient;
  } catch (error) {
    console.error('[Supabase] Failed to initialize browser client:', error);
    return null;
  }
}

export function getSupabaseDirectClient(): SupabaseClient | null {
  if (directClient) return directClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  try {
    directClient = createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
    return directClient;
  } catch (error) {
    return null;
  }
}

