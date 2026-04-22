// js/supabase-client.js

// --- IMPORTANT: YAHAN APNI SUPABASE DETAILS DAALEIN ---
// Maine aapki di hui details daal di hain. Agar aapne keys badli hain, toh isse update karein.
const SUPABASE_URL = 'https://fxpxsmnakwqczgrhiwkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cHhzbW5ha3dxY3pncmhpd2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MjU5MzAsImV4cCI6MjA5MjQwMTkzMH0.-gmIrIiWakuHKOiuDnlW9ZQOJWRntDHUTkzXiU79Hao';

let supabase;

// Safety check to ensure the global 'supabase' object from the CDN is available
if (window.supabase) {
    // Initialize the client using the global object
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    const errorMsg = "Supabase library not loaded. Make sure the CDN script tag is included before your custom scripts in the HTML.";
    console.error(errorMsg);
    alert(errorMsg);
}

// Export the initialized client so other files can use it.
// We are exporting it with the name 'supabase' so that `import { supabase } from '...'` works.
export { supabase };
