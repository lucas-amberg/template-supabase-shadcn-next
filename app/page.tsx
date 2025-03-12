"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex gap-4">
                <Button
                    asChild
                    variant="default">
                    <Link href="/login">Log in</Link>
                </Button>
                <Button
                    asChild
                    variant="default"
                    className="bg-green-600 hover:bg-green-700">
                    <Link href="/signup">Sign up</Link>
                </Button>
            </div>
        </div>
    );
}
