// supabaseClient.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL || "https://kqkmvvphfrmmeihnavxd.supabase.co",
  process.env.SUPABASE_SERVICE_KEY || "sb_publishable_5EHHk8RnfwlNfuEhd5UqvQ_lnJuuG-f"
);
