import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Parse the form data
    const formData = await request.formData();

    // Get user token from form data
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.json(
        { error: "User token is required" },
        { status: 400 }
      );
    }

    // Verify the token and get user info
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token", details: authError?.message },
        { status: 401 }
      );
    }

    // Extract form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const rentAmount = parseFloat(formData.get("rent_amount") as string);
    const depositAmount =
      parseFloat(formData.get("deposit_amount") as string) || 0;
    const location = formData.get("location") as string;
    const contactNumber = formData.get("contact_number") as string;
    const imageUrl = formData.get("image_url") as string | null;
    const tags = JSON.parse(formData.get("tags") as string);

    // Validate required fields
    if (!title || isNaN(rentAmount)) {
      return NextResponse.json(
        { error: "Title and valid rent amount are required" },
        { status: 400 }
      );
    }

    // Insert into rent_posts table
    const { data, error } = await supabase
      .from("rent_posts")
      .insert([
        {
          user_id: user.id,
          title,
          description,
          category,
          rent_amount: rentAmount,
          deposit_amount: depositAmount,
          location,
          contact_number: contactNumber,
          image_url: imageUrl,
          tags,
          is_active: true,
          views_count: 0,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating rent post:", error);
      return NextResponse.json(
        { error: "Failed to create rent post", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Rent post created successfully",
        data: data[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in rent-posts API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("rent_posts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching rent posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch rent posts" },
      { status: 500 }
    );
  }
}
