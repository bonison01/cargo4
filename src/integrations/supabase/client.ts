
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hyddakfwhxjdkbbnjpha.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZGRha2Z3aHhqZGtiYm5qcGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTY0NDAsImV4cCI6MjA1NjIzMjQ0MH0.MfXQ5q4imGKsUdw0MO9rQuDOMWFskO3RVwSgxz5LjTU";

// This client will be used throughout our application
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
