export interface Profile {
    id: string;
    display_name: string;
    email: string;
    updated_at?: string;
    created_at?: string;
}

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, "updated_at" | "created_at">;
                Update: Partial<Omit<Profile, "id">>;
            };
        };
    };
}
