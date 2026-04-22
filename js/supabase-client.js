// js/supabase-client.js

// IMPORTANT: REPLACE WITH YOUR SUPABASE PROJECT DETAILS
const SUPABASE_URL = 'YAHAN_APNA_SUPABASE_PROJECT_URL_DAALEIN';
const SUPABASE_ANON_KEY = 'YAHAN_APNA_SUPABASE_ANON_KEY_DAALEIN';

if (!SUPABASE_URL || SUPABASE_URL.includes('YAHAN_APNA')) {
    console.error("***********************************************************************************");
    console.error("** ERROR: Supabase URL and Key are required.                                     **");
    console.error("** Please update 'js/supabase-client.js' with your project's details.          **");
    console.error("***********************************************************************************");
    alert("Supabase client is not configured. Please check the console for details.");
}

// Initialize Supabase client and export it for use in other scripts
export const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);