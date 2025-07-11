import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CreateTripData, Database } from "@/lib/supabase/types";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

  try {
    const body: CreateTripData = await request.json();

    // Create a Supabase client configured for server-side use
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    // Get the current user - this will use the session from cookies
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized - Please sign in", details: authError?.message },
        { status: 401 }
      );
    }

    // Create the trip in the database
    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        title: body.title,
        destination: body.destination,
        start_date: body.start_date || null,
        end_date: body.end_date || null,
        family_composition: body.family_composition || {
          adults: 2,
          children: [],
        },
        preferences: body.preferences || {},
        status: body.status || "planning",
        total_budget: body.total_budget || null,
        is_public: body.is_public || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create trip", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, trip });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const response = NextResponse.next();

  try {
    // Create a Supabase client configured for server-side use
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    // Get the current user - this will use the session from cookies
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Auth error:", authError);
      return NextResponse.json(
        { error: "Unauthorized - Please sign in", details: authError?.message },
        { status: 401 }
      );
    }

    // Get all trips for the user
    const { data: trips, error } = await supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch trips", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
