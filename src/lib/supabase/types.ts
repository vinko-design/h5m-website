export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      waitlist_signups: {
        Row: {
          id: string;
          email: string;
          consent_given: boolean;
          source: string | null;
          confirmed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          consent_given?: boolean;
          source?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          consent_given?: boolean;
          source?: string | null;
          confirmed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type WaitlistSignup = Database["public"]["Tables"]["waitlist_signups"]["Row"];
export type WaitlistSignupInsert =
  Database["public"]["Tables"]["waitlist_signups"]["Insert"];
