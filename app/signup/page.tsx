"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const checkResponse = await fetch("/api/profile/check-username", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username }),
            });

            const { available, error: checkError } = await checkResponse.json();

            if (checkError) {
                setError(checkError);
                toast.error(checkError);
                return;
            }

            if (!available) {
                setError("Username is already taken");
                toast.error("Username is already taken");
                return;
            }

            const { data: authData, error: authError } = await register(
                email,
                password,
                username,
            );

            if (authError || !authData) {
                setError(authError?.message || "An unexpected error occurred");
                toast.error(
                    authError?.message || "An unexpected error occurred",
                );
                return;
            }

            const createProfileResponse = await fetch("/api/profile/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: authData.user.id,
                    email: email,
                    username: username,
                }),
            });

            const { error: profileError } = await createProfileResponse.json();

            if (profileError) {
                console.error("Profile creation error:", profileError);
                toast.error(
                    "Account created but profile setup failed. Please contact support.",
                );
            } else {
                toast.success(
                    "Signup successful! Please check your email for verification.",
                );
            }
        } catch (err) {
            const errorMessage = "An unexpected error occurred";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(err);
        } finally {
            setPassword("");
            setIsLoading(false);
        }
    };

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value.toLowerCase());
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.toLowerCase());
    };

    if (user) {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <ToastContainer
                position="top-right"
                autoClose={5000}
            />
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Sign up</CardTitle>
                    <CardDescription>Create your account</CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    required
                                    value={username}
                                    onChange={handleUsernameChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    value={email}
                                    onChange={handleEmailChange}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Create a password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Sign up"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
