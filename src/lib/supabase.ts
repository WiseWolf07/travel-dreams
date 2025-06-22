import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pjatzrunallpdkuchcsj.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYXR6cnVuYWxscGRrdWNoY3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NTQ5MjQsImV4cCI6MjA2NjEzMDkyNH0.OWnoomP4EpNkVDJFQfnk2cgywM1LJz8SDm2eku2hmoM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)