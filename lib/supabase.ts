import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(
    email: string,
    password: string,
    username: string,
) {
    const lowerEmail = email.toLowerCase();
    const lowerUsername = username.toLowerCase();

    const { data, error } = await supabase.auth.signUp({
        email: lowerEmail,
        password,
        options: {
            data: {
                display_name: lowerUsername,
            },
        },
    });

    return { data, error };
}

export async function signIn(email: string, password: string) {
    const lowerEmail = email.toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: lowerEmail,
        password,
    });

    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
}
