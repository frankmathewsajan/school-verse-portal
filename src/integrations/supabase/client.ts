import { createClient } from '@supabase/supabase-js';
import type { Database } from './types.js';

const SUPABASE_URL = "https://plgjavfrwcphrehmthdv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2phdmZyd2NwaHJlaG10aGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2ODE3ODcsImV4cCI6MjA2NzI1Nzc4N30.73hjYMk1hrqiuhFV-AoVtbRdYc6biciDqnFhtz4sq5o";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
