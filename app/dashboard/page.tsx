"use client";

import { useAuth } from "@/context/auth-context";

export default function DashboardPage() {
    const { user } = useAuth();
    const displayName =
        user?.user_metadata?.display_name ||
        user?.email?.split("@")[0] ||
        "User";

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Welcome, {displayName}!</h2>
            <p className="text-gray-600">
                This is a protected page that only authenticated users can
                access.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Profile</h3>
                    <p className="text-gray-600">
                        Manage your personal information and account settings.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Settings</h3>
                    <p className="text-gray-600">
                        Configure your application preferences and
                        notifications.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Activity</h3>
                    <p className="text-gray-600">
                        View your recent activity and account history.
                    </p>
                </div>
            </div>
        </div>
    );
}
