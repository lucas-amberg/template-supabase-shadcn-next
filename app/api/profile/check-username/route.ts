import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
    try {
        const { username } = await request.json();

        const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

        const { data: existingProfile, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("display_name", username)
            .single();

        if (error && error.code !== "PGRST116") {
            return NextResponse.json(
                { error: "Error checking username" },
                { status: 500 },
            );
        }

        return NextResponse.json({
            available: !existingProfile,
        });
    } catch (error) {
        console.error("Username check error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}
