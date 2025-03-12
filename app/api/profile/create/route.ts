import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(request: Request) {
    try {
        const { userId, email, username } = await request.json();

        // Input validation
        if (!userId || !email || !username) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 },
            );
        }

        // Validate username format (alphanumeric and underscores only)
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json(
                {
                    error: "Username can only contain letters, numbers, and underscores",
                },
                { status: 400 },
            );
        }

        // Check if username already exists
        const { data: existingProfile, error: checkError } = await supabase
            .from("profiles")
            .select("id")
            .eq("display_name", username)
            .single();

        if (checkError && checkError.code !== "PGRST116") {
            return NextResponse.json(
                { error: "Error checking username availability" },
                { status: 500 },
            );
        }

        if (existingProfile) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 400 },
            );
        }

        // Create profile
        const { error: insertError } = await supabase
            .from("profiles")
            .insert([
                {
                    id: userId,
                    email: email,
                    display_name: username,
                },
            ])
            .single();

        if (insertError) {
            console.error("Profile creation error:", insertError);
            return NextResponse.json(
                { error: "Error creating profile" },
                { status: 500 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Profile creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
