import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/server";

// Generate a unique filename using timestamp and random number
const generateUniqueName = (originalName: string) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = originalName.split('.').pop();
  return `${timestamp}-${random}.${ext}`;
};

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
    // Safely parse rent and deposit amounts
    const rentAmount = Number(formData.get("rent_amount")) || 0;
    const depositAmount = Number(formData.get("deposit_amount")) || 0;
    const location = formData.get("location") as string;
    const contactNumber = formData.get("contact_number") as string;
    const tags = JSON.parse(formData.get("tags") as string);
    const images = formData.getAll("images") as File[];

    // Validate required fields
    if (!title || isNaN(rentAmount)) {
      return NextResponse.json(
        { error: "Title and valid rent amount are required" },
        { status: 400 }
      );
    }

    // First, create the rent post to get the ID for the upload path
    const { data: postData, error: postError } = await supabase
      .from('rent_posts')
      .insert([{
        user_id: user.id,
        title,
        description,
        category,
        rent_amount: rentAmount,
        deposit_amount: depositAmount,
        location,
        contact_number: contactNumber,
        tags,
        is_active: true,
        views_count: 0,
      }])
      .select()
      .single();

    if (postError || !postData) {
      console.error('Error creating rent post:', postError);
      return NextResponse.json(
        { error: 'Failed to create rent post', details: postError?.message },
        { status: 500 }
      );
    }

    // Handle image uploads if any
    if (images && images.length > 0) {
      const folderPath = `${user.id}/rent_post/${postData.id}`;
      const imageUrls: string[] = [];
      
      // Upload all images and collect their URLs
      await Promise.all(images.map(async (file) => {
        const fileName = generateUniqueName(file.name);
        const filePath = `${folderPath}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);
          
        if (!uploadError) {
          // Get the public URL of the uploaded file
          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);
            
          imageUrls.push(publicUrl);
        }
      }));
      
      // Update the post with the image URLs array
      if (imageUrls.length > 0) {
        await supabase
          .from('rent_posts')
          .update({ image_urls: imageUrls })
          .eq('id', postData.id);
      }
    }

    // Get the updated post with the image URL
    const { data: updatedPost } = await supabase
      .from('rent_posts')
      .select('*')
      .eq('id', postData.id)
      .single();

    return NextResponse.json(
      {
        message: "Rent post created successfully",
        data: updatedPost || postData,
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
