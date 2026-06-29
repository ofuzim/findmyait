const env = import.meta.env;

export const supabaseUrl = env.VITE_SUPABASE_URL || "";

export const projectId =
  env.VITE_SUPABASE_PROJECT_ID ||
  (() => {
    try {
      return supabaseUrl ? new URL(supabaseUrl).hostname.split(".")[0] : "";
    } catch {
      return "";
    }
  })();

export const publicAnonKey =
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || "";
