import { getSupabase } from "./supabase";

export async function getOrCreateUser(name: string, isHost = false) {
  const supabase = getSupabase();

  const { data: existingUser } = await (supabase
    .from("users") as any)
    .select("id, name")
    .eq("name", name)
    .single();

  if (existingUser) {
    return existingUser;
  }

  const { data: newUser, error: createError } = await (supabase
    .from("users") as any)
    .insert({ name, is_host: isHost })
    .select("id, name")
    .single();

  if (createError) {
    console.error("Error creating user:", createError);
    return { id: crypto.randomUUID(), name };
  }

  return newUser;
}

export function generateUserId(): string {
  return crypto.randomUUID();
}
