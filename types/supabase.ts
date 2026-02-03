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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      addons: {
        Row: {
          description: string
          id: string
          price: number
          type: string
        }
        Insert: {
          description: string
          id?: string
          price: number
          type: string
        }
        Update: {
          description?: string
          id?: string
          price?: number
          type?: string
        }
        Relationships: []
      }
      booking_addons: {
        Row: {
          addon_type: string
          booking_id: string
          created_at: string
          description: string
          id: string
          price: number
          quantity: number
        }
        Insert: {
          addon_type: string
          booking_id: string
          created_at?: string
          description: string
          id?: string
          price: number
          quantity?: number
        }
        Update: {
          addon_type?: string
          booking_id?: string
          created_at?: string
          description?: string
          id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_addons_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booked_at: string
          calculated_price: number | null
          discount_amount: number | null
          discount_percent: number | null
          discount_reason: string | null
          end_date: string
          id: string
          last_payment_id: string | null
          notes: string | null
          number_of_people: number
          payment_status: string
          special_requests: string | null
          start_date: string
          status: string
          total_price: number
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booked_at?: string
          calculated_price?: number | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_reason?: string | null
          end_date: string
          id?: string
          last_payment_id?: string | null
          notes?: string | null
          number_of_people: number
          payment_status?: string
          special_requests?: string | null
          start_date: string
          status?: string
          total_price: number
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booked_at?: string
          calculated_price?: number | null
          discount_amount?: number | null
          discount_percent?: number | null
          discount_reason?: string | null
          end_date?: string
          id?: string
          last_payment_id?: string | null
          notes?: string | null
          number_of_people?: number
          payment_status?: string
          special_requests?: string | null
          start_date?: string
          status?: string
          total_price?: number
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_last_payment_id_fkey"
            columns: ["last_payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_featured: boolean | null
          location: string
          main_image_url: string
          name: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          is_featured?: boolean | null
          location: string
          main_image_url: string
          name: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_featured?: boolean | null
          location?: string
          main_image_url?: string
          name?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "destinations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          booking_id: string
          created_at: string
          currency: string
          details: Json
          due_date: string | null
          id: string
          invoice_number: string
          issued_at: string
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          currency?: string
          details: Json
          due_date?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string
          status?: string
          total_amount: number
          user_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          currency?: string
          details?: Json
          due_date?: string | null
          id?: string
          invoice_number?: string
          issued_at?: string
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          currency: string
          error_message: string | null
          id: string
          invoice_id: string | null
          payment_intent_id: string | null
          payment_method: string
          processed_at: string
          refunded_at: string | null
          status: string
        }
        Insert: {
          amount: number
          booking_id: string
          currency?: string
          error_message?: string | null
          id?: string
          invoice_id?: string | null
          payment_intent_id?: string | null
          payment_method: string
          processed_at?: string
          refunded_at?: string | null
          status: string
        }
        Update: {
          amount?: number
          booking_id?: string
          currency?: string
          error_message?: string | null
          id?: string
          invoice_id?: string | null
          payment_intent_id?: string | null
          payment_method?: string
          processed_at?: string
          refunded_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_booking"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoice_payment_status"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      role_changes: {
        Row: {
          changed_at: string
          changed_by: string
          id: string
          new_role: string
          old_role: string
          user_id: string
        }
        Insert: {
          changed_at?: string
          changed_by: string
          id?: string
          new_role: string
          old_role: string
          user_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string
          id?: string
          new_role?: string
          old_role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_changes_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_changes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          destination_id: string
          extra_featured_images: string[] | null
          id: string
          is_featured: boolean | null
          main_featured_image_url: string
          name: string
          price: number | null
          rating: number | null
          short_description: string
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          destination_id: string
          extra_featured_images?: string[] | null
          id?: string
          is_featured?: boolean | null
          main_featured_image_url: string
          name: string
          price?: number | null
          rating?: number | null
          short_description: string
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          destination_id?: string
          extra_featured_images?: string[] | null
          id?: string
          is_featured?: boolean | null
          main_featured_image_url?: string
          name?: string
          price?: number | null
          rating?: number | null
          short_description?: string
          slug?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          favorite_trips: string[] | null
          first_name: string
          id: string
          last_name: string
          logo_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          favorite_trips?: string[] | null
          first_name: string
          id: string
          last_name: string
          logo_url?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          favorite_trips?: string[] | null
          first_name?: string
          id?: string
          last_name?: string
          logo_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      invoice_payment_status: {
        Row: {
          invoice_id: string | null
          invoice_number: string | null
          paid_amount: number | null
          payment_status: string | null
          total_amount: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_trigger_active: { Args: { trigger_name: string }; Returns: boolean }
      set_trigger_active: { Args: { trigger_name: string }; Returns: undefined }
      unset_trigger_active: {
        Args: { trigger_name: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
