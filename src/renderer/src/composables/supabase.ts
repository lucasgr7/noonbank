import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.RENDERER_VITE_API_URL,
  import.meta.env.RENDERER_VITE_API_KEY );
