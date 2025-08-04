import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://knyayfeqtahewzwelqgw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueWF5ZmVxdGFoZXd6d2VscWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTYwOTMsImV4cCI6MjA1Nzg3MjA5M30.BhjsrJvhfu5elckOmyrezPS4vrB7f8B8ka5y4lLoImQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10, // Adjust as needed
    },
  },
});

export default supabase;
