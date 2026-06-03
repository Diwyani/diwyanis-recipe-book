import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

supabase
  .from("recipes")
  .select("*")
  .ilike("title", `%${query}%`) // case-insensitive, partial match

  supabase
  .from("recipes")
  .select("*")
  .eq("category", "breakfast")

  supabase
  .from("recipes")
  .select("*")
  .ilike("title", `%${query}%`)
  .eq("category", "breakfast")
  .lte("time_minutes", 30) // less than or equal, e.g. "under 30 mins"