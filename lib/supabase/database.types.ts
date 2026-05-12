export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          college_id: string | null;
          avatar_url: string | null;
          role: string | null;
          bio: string | null;
          course: string | null;
          year: string | null;
          hostel: string | null;
          linkedin_url: string | null;
          instagram_username: string | null;
          public_profile?: boolean | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
