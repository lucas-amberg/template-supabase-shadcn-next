import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create a Supabase client with admin privileges
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    },
);

export async function POST(request: Request) {
    try {
        const { id, email, displayName } = await request.json();

        // Check if display name already exists
        const { data: existingProfiles, error: checkError } =
            await supabaseAdmin
                .from("profiles")
                .select("display_name")
                .eq("display_name", displayName)
                .limit(1);

        if (checkError) {
            return NextResponse.json(
                { error: checkError.message },
                { status: 500 },
            );
        }

        if (existingProfiles && existingProfiles.length > 0) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 409 },
            );
        }

        // Create profile
        const { data, error } = await supabaseAdmin
            .from("profiles")
            .insert([
                {
                    id,
                    email,
                    display_name: displayName,
                },
            ])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error("Error creating profile:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
