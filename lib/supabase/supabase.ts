import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}
