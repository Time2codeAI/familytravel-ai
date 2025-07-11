import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/types";

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

    // Also get the session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    return NextResponse.json({
      user: user ? { id: user.id, email: user.email } : null,
      session: session
        ? {
            access_token: session.access_token ? "present" : "missing",
            refresh_token: session.refresh_token ? "present" : "missing",
            expires_at: session.expires_at,
          }
        : null,
      authError: authError?.message || null,
      sessionError: sessionError?.message || null,
      cookies: {
        names: cookieStore.getAll().map((c) => c.name),
        count: cookieStore.getAll().length,
      },
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
