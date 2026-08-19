import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';

export let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
    console.log(`🔌 Connected to Supabase Database: ${supabaseUrl}`);
  } catch (error) {
    console.warn('⚠️ Could not initialize Supabase client, falling back to local persistent store:', error);
    supabase = null;
  }
} else {
  console.log('ℹ️ No SUPABASE_URL / SUPABASE_KEY provided. Using high-performance in-memory store.');
}

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};
