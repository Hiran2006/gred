import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env vars are missing");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const BUCKET = "property-images"; // ensure this bucket exists and is public

    // Initialize fields
    let title = "";
    let description: string | null = null;
    let category = "";
    let location = "";
    let contact_number: string | null = null;
    let is_active = true;
    let rent_amount_raw: unknown;
    let deposit_amount_raw: unknown = 0;
    let image_url: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      // Handle file uploads via formData
      const form = await req.formData();
      title = (form.get("title") ?? "").toString().trim();
      description = form.get("description")?.toString() ?? null;
      category = (form.get("category") ?? "").toString().trim();
      location = (form.get("location") ?? "").toString().trim();
      contact_number = form.get("contact_number")?.toString() ?? null;
      is_active = (form.get("is_active") ?? "true").toString() !== "false";
      rent_amount_raw = form.get("rent_amount");
      deposit_amount_raw = form.get("deposit_amount") ?? 0;

      // Get files (first image)
      const files = form.getAll("images");
      const firstFile = files.find((f) => typeof f !== "string") as File | undefined;
      if (firstFile) {
        const ext = firstFile.name.split(".").pop() || "jpg";
        const filePath = `rent/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, firstFile, {
            contentType: firstFile.type || `image/${ext}`,
            upsert: false,
          });
        if (uploadError) {
          return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
        }
        const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
        image_url = publicData.publicUrl;
      }
    } else {
      // JSON fallback
      const body = await req.json();
      title = (body.title ?? "").toString().trim();
      description = body.description?.toString() ?? null;
      category = (body.category ?? "").toString().trim();
      location = (body.location ?? "").toString().trim();
      contact_number = body.contact_number ? body.contact_number.toString() : null;
      is_active = typeof body.is_active === "boolean" ? body.is_active : true;
      rent_amount_raw = body.rent_amount;
      deposit_amount_raw = body.deposit_amount ?? 0;
      const images = Array.isArray(body.images) ? body.images : [];
      image_url = body.image_url || images[0] || null;
    }

    // Basic validations
    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    if (!category) errors.category = "Category is required";
    if (!location) errors.location = "Location is required";

    const rent_amount = Number(rent_amount_raw);
    if (!Number.isFinite(rent_amount) || rent_amount <= 0) {
      errors.rent_amount = "Valid rent amount is required";
    }

    const deposit_amount = Number(deposit_amount_raw);
    if (!Number.isFinite(deposit_amount) || deposit_amount < 0) {
      errors.deposit_amount = "Deposit amount must be 0 or more";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    // Insert payload shaped to your DB columns
    const payload = {
      title,
      description,
      category,
      location,
      contact_number,
      rent_amount,
      deposit_amount,
      image_url,
      is_active,
    } as const;

    const { data, error } = await supabase
      .from("rent_posts")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Unexpected error", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
