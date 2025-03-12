"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    if (user) {
        return null;
    }

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
