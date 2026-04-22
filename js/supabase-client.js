// js/supabase-client.js

// --- IMPORTANT: YAHAN APNI SUPABASE DETAILS DAALEIN ---
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

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

// A safety check to ensure keys are filled before exporting
if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_SUPABASE')) {
    const errorMsg = "Supabase client is not configured. Please update 'js/supabase-client.js' with your project details.";
    console.error(errorMsg);
    // We don't alert here again to avoid double alerts, console error is enough.
}

// Export the initialized client so other files can use it.
export { supabase };
