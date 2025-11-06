export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      banks: {
        Row: {
          account_types: string[]
          created_at: string
          description: string
          features: string[]
          id: string
          interest_rates: Json
          locations: string[]
          logo_text: string
          name: string
          rating: number
          updated_at: string
        }
        Insert: {
          account_types?: string[]
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          interest_rates?: Json
          locations?: string[]
          logo_text: string
          name: string
          rating?: number
          updated_at?: string
        }
        Update: {
          account_types?: string[]
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          interest_rates?: Json
          locations?: string[]
          logo_text?: string
          name?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          publish_date: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      careers: {
        Row: {
          application_deadline: string | null
          benefits: string[] | null
          created_at: string
          department: string
          description: string
          employment_type: string
          experience_level: string
          id: string
          is_active: boolean
          location: string
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string[] | null
          created_at?: string
          department: string
          description: string
          employment_type?: string
          experience_level?: string
          id?: string
          is_active?: boolean
          location: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          benefits?: string[] | null
          created_at?: string
          department?: string
          description?: string
          employment_type?: string
          experience_level?: string
          id?: string
          is_active?: boolean
          location?: string
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_guides: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          difficulty_level: string
          estimated_read_time: number | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean
          meta_description: string | null
          meta_title: string | null
          publish_date: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category?: string
          content: string
          created_at?: string
          difficulty_level?: string
          estimated_read_time?: number | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          difficulty_level?: string
          estimated_read_time?: number | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          meta_description?: string | null
          meta_title?: string | null
          publish_date?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          applicant_name: string
          application_data: Json | null
          application_status: string
          created_at: string
          credit_score: number | null
          email: string
          employment_status: string | null
          id: string
          loan_amount: number
          loan_type: string
          monthly_income: number
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          applicant_name: string
          application_data?: Json | null
          application_status?: string
          created_at?: string
          credit_score?: number | null
          email: string
          employment_status?: string | null
          id?: string
          loan_amount: number
          loan_type: string
          monthly_income: number
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          applicant_name?: string
          application_data?: Json | null
          application_status?: string
          created_at?: string
          credit_score?: number | null
          email?: string
          employment_status?: string | null
          id?: string
          loan_amount?: number
          loan_type?: string
          monthly_income?: number
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      loan_products: {
        Row: {
          created_at: string
          description: string
          eligibility_criteria: Json | null
          features: string[] | null
          id: string
          interest_rate_max: number
          interest_rate_min: number
          is_active: boolean
          max_amount: number
          max_term_months: number
          min_amount: number
          min_term_months: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          eligibility_criteria?: Json | null
          features?: string[] | null
          id?: string
          interest_rate_max?: number
          interest_rate_min?: number
          is_active?: boolean
          max_amount?: number
          max_term_months?: number
          min_amount?: number
          min_term_months?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          eligibility_criteria?: Json | null
          features?: string[] | null
          id?: string
          interest_rate_max?: number
          interest_rate_min?: number
          is_active?: boolean
          max_amount?: number
          max_term_months?: number
          min_amount?: number
          min_term_months?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      press_releases: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean
          location: string | null
          meta_description: string | null
          meta_title: string | null
          press_contact_email: string | null
          press_contact_name: string | null
          press_contact_phone: string | null
          publish_date: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          press_contact_email?: string | null
          press_contact_name?: string | null
          press_contact_phone?: string | null
          publish_date?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          location?: string | null
          meta_description?: string | null
          meta_title?: string | null
          press_contact_email?: string | null
          press_contact_name?: string | null
          press_contact_phone?: string | null
          publish_date?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          aadhar_card_url: string | null
          aadhar_number: string | null
          address: string | null
          address_proof_url: string | null
          avatar_url: string | null
          bank_statement_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          employer_name: string | null
          employment_status: string | null
          full_name: string | null
          id: string
          income_certificate_url: string | null
          monthly_income: number | null
          occupation: string | null
          pan_card_url: string | null
          pan_number: string | null
          phone: string | null
          postal_code: string | null
          profile_completed: boolean
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhar_card_url?: string | null
          aadhar_number?: string | null
          address?: string | null
          address_proof_url?: string | null
          avatar_url?: string | null
          bank_statement_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          employer_name?: string | null
          employment_status?: string | null
          full_name?: string | null
          id?: string
          income_certificate_url?: string | null
          monthly_income?: number | null
          occupation?: string | null
          pan_card_url?: string | null
          pan_number?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_completed?: boolean
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhar_card_url?: string | null
          aadhar_number?: string | null
          address?: string | null
          address_proof_url?: string | null
          avatar_url?: string | null
          bank_statement_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          employer_name?: string | null
          employment_status?: string | null
          full_name?: string | null
          id?: string
          income_certificate_url?: string | null
          monthly_income?: number | null
          occupation?: string | null
          pan_card_url?: string | null
          pan_number?: string | null
          phone?: string | null
          postal_code?: string | null
          profile_completed?: boolean
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar: string
          bio: string
          created_at: string
          display_order: number
          id: string
          name: string
          position: string
          updated_at: string
        }
        Insert: {
          avatar: string
          bio: string
          created_at?: string
          display_order?: number
          id?: string
          name: string
          position: string
          updated_at?: string
        }
        Update: {
          avatar?: string
          bio?: string
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar: string | null
          company: string | null
          content: string
          created_at: string
          id: string
          is_published: boolean
          name: string
          rating: number | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          company?: string | null
          content: string
          created_at?: string
          id?: string
          is_published?: boolean
          name: string
          rating?: number | null
          role: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          company?: string | null
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          name?: string
          rating?: number | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_queries: {
        Row: {
          admin_response: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          query_type: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          query_type?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          query_type?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          last_login: string | null
          phone: string | null
          registration_date: string
          status: string
          updated_at: string
          user_data: Json | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          last_login?: string | null
          phone?: string | null
          registration_date?: string
          status?: string
          updated_at?: string
          user_data?: Json | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_login?: string | null
          phone?: string | null
          registration_date?: string
          status?: string
          updated_at?: string
          user_data?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
