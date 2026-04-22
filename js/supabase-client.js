// js/supabase-client.js

// IMPORTANT: REPLACE WITH YOUR SUPABASE PROJECT DETAILS
const SUPABASE_URL = 'https://fxpxsmnakwqczgrhiwkl.supabase.co'; // Aapki URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cHhzbW5ha3dxY3pncmhpd2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjU5MzAsImV4cCI6MjA5MjQwMTkzMH0.-gmIrIiWakuHKOiuDnlW9ZQOJWRntDHUTkzXiU79Hao'; // Aapki Key

// A safety check to ensure keys are filled
if (!SUPABASE_URL || SUPABASE_URL.includes('YAHAN_APNA')) {
    const errorMsg = "Supabase client is not configured. Please update 'js/supabase-client.js' with your project details.";
    console.error(errorMsg);
    alert(errorMsg);
}

// Initialize Supabase client using the global 'supabase' object from the CDN
// Note: We use supabase.createClient (lowercase 's') which is the method provided by the global library
export const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
