// Dans votre fichier src/lib/supabaseClient.js ou src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Créez le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);