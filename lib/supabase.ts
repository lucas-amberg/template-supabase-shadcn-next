import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function checkUsernameExists(username: string) {
    try {
        const response = await fetch(
            `/api/username/check?username=${encodeURIComponent(username)}`,
        );
        if (!response.ok) {
            throw new Error("Failed to check username");
        }
        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error("Error checking username:", error);
        throw error;
    }
}

export async function createProfile(
    userId: string,
    email: string,
    displayName: string,
) {
    const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: userId,
            email,
            displayName,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create profile");
    }

    return await response.json();
}

export async function signUp(
    email: string,
    password: string,
    username: string,
) {
    const lowerEmail = email.toLowerCase();
    const lowerUsername = username.toLowerCase();

    // Check if username exists first
    try {
        const usernameExists = await checkUsernameExists(lowerUsername);
        if (usernameExists) {
            return {
                data: null,
                error: { message: "Username already exists" },
            };
        }

        // If username is available, proceed with signup
        const { data, error } = await supabase.auth.signUp({
            email: lowerEmail,
            password,
            options: {
                data: {
                    display_name: lowerUsername,
                },
            },
        });

        if (error) {
            return { data, error };
        }

        // If signup is successful, create a profile
        if (data.user) {
            try {
                await createProfile(data.user.id, lowerEmail, lowerUsername);
            } catch (profileError) {
                console.error("Error creating profile:", profileError);
                // We don't want to fail the signup if profile creation fails
                // The user can create their profile later
            }
        }

        return { data, error };
    } catch (err) {
        console.error("Error during signup:", err);
        return {
            data: null,
            error: {
                message:
                    err instanceof Error
                        ? err.message
                        : "An unexpected error occurred",
            },
        };
    }
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
