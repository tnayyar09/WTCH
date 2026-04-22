// js/supabase-client.js

// Aapki Sahi URL aur Key
const SUPABASE_URL = 'https://fxpxsmnakwqczgrhiwkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cHhzbW5ha3dxY3pncmhpd2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjU5MzAsImV4cCI6MjA5MjQwMTkzMH0.-gmIrIiWakuHKOiuDnlW9ZQOJWRntDHUTkzXiU79Hao';


// Yeh check ab zaroori nahi, lekin rakhte hain
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error("Supabase URL and Key are required.");
    alert("Supabase client is not configured.");
}

// Initialize Supabase client and export it for use in other scripts
export const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
