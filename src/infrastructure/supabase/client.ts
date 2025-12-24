import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseURL || !supabaseKey) {
    throw new Error ('Supabase tidak terkoneksi atau belum di konfigurasi');
    }

    export const supabase = createClient(supabaseURL, supabaseKey, {
        auth: {
            persistSession: true
        }
    });