// Database types for Supabase based on existing schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          family_size: number;
          children_ages: number[];
          dietary_restrictions: string[];
          mobility_needs: string | null;
          preferred_language: string;
          emergency_contact: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          family_size?: number;
          children_ages?: number[];
          dietary_restrictions?: string[];
          mobility_needs?: string | null;
          preferred_language?: string;
          emergency_contact?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          family_size?: number;
          children_ages?: number[];
          dietary_restrictions?: string[];
          mobility_needs?: string | null;
          preferred_language?: string;
          emergency_contact?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          start_date: string | null;
          end_date: string | null;
          family_composition: {
            adults: number;
            children: number[];
          };
          preferences: {
            interests?: string[];
            budget?: "low" | "medium" | "high";
            [key: string]: any;
          };
          status: string;
          total_budget: number | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          destination: string;
          start_date?: string | null;
          end_date?: string | null;
          family_composition?: {
            adults: number;
            children: number[];
          };
          preferences?: {
            interests?: string[];
            budget?: "low" | "medium" | "high";
            [key: string]: any;
          };
          status?: string;
          total_budget?: number | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          destination?: string;
          start_date?: string | null;
          end_date?: string | null;
          family_composition?: {
            adults: number;
            children: number[];
          };
          preferences?: {
            interests?: string[];
            budget?: "low" | "medium" | "high";
            [key: string]: any;
          };
          status?: string;
          total_budget?: number | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      trip_items: {
        Row: {
          id: string;
          trip_id: string;
          category: string;
          title: string;
          description: string | null;
          content: any;
          status: string;
          ai_prompt: string | null;
          ai_response: string | null;
          location_data: any;
          priority: number;
          estimated_cost: number | null;
          visit_date: string | null;
          rating: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          category: string;
          title: string;
          description?: string | null;
          content?: any;
          status?: string;
          ai_prompt?: string | null;
          ai_response?: string | null;
          location_data?: any;
          priority?: number;
          estimated_cost?: number | null;
          visit_date?: string | null;
          rating?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          category?: string;
          title?: string;
          description?: string | null;
          content?: any;
          status?: string;
          ai_prompt?: string | null;
          ai_response?: string | null;
          location_data?: any;
          priority?: number;
          estimated_cost?: number | null;
          visit_date?: string | null;
          rating?: number | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trip_expenses: {
        Row: {
          id: string;
          trip_id: string;
          trip_item_id: string | null;
          user_id: string;
          title: string;
          amount: number;
          category: string | null;
          description: string | null;
          receipt_url: string | null;
          expense_date: string;
          split_among: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          trip_item_id?: string | null;
          user_id: string;
          title: string;
          amount: number;
          category?: string | null;
          description?: string | null;
          receipt_url?: string | null;
          expense_date?: string;
          split_among?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          trip_item_id?: string | null;
          user_id?: string;
          title?: string;
          amount?: number;
          category?: string | null;
          description?: string | null;
          receipt_url?: string | null;
          expense_date?: string;
          split_among?: string[];
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          trip_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          metadata?: any;
          created_at?: string;
        };
      };
    };
  };
}

// Application types
export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  family_composition: {
    adults: number;
    children: number[];
  };
  preferences: {
    interests?: string[];
    budget?: "low" | "medium" | "high";
    [key: string]: any;
  };
  status: string;
  total_budget: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  family_size: number;
  children_ages: number[];
  dietary_restrictions: string[];
  mobility_needs: string | null;
  preferred_language: string;
  emergency_contact: any | null;
  created_at: string;
  updated_at: string;
}

export interface TripItem {
  id: string;
  trip_id: string;
  category: string;
  title: string;
  description: string | null;
  content: any;
  status: string;
  ai_prompt: string | null;
  ai_response: string | null;
  location_data: any;
  priority: number;
  estimated_cost: number | null;
  visit_date: string | null;
  rating: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TripExpense {
  id: string;
  trip_id: string;
  trip_item_id: string | null;
  user_id: string;
  title: string;
  amount: number;
  category: string | null;
  description: string | null;
  receipt_url: string | null;
  expense_date: string;
  split_among: string[];
  created_at: string;
}

export interface ChatMessage {
  id: string;
  trip_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata: any;
  created_at: string;
}

export interface CreateTripData {
  title: string;
  destination: string;
  start_date?: string;
  end_date?: string;
  family_composition?: {
    adults: number;
    children: number[];
  };
  preferences?: {
    interests?: string[];
    budget?: "low" | "medium" | "high";
    [key: string]: any;
  };
  status?: string;
  total_budget?: number;
  is_public?: boolean;
}
