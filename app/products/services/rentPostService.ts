import supabase from '@/lib/supabase/client';

type RentPost = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  rent_amount: number;
  deposit_amount: number;
  is_active: boolean;
  location: string | null;
  tags: string[];
  contact_number: string | null;
  views_count: number;
  created_at: string;
  image_urls: string[];
};

export async function fetchRentPosts(status: 'all' | 'active' | 'inactive' = 'all') {
  try {
    let query = supabase
      .from('rent_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('is_active', status === 'active');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching rent posts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchRentPosts:', error);
    throw error;
  }
}

export async function fetchRentPostById(id: string) {
  try {
    const { data, error } = await supabase
      .from('rent_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching rent post ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchRentPostById:', error);
    throw error;
  }
}

export async function createRentPost(post: Omit<RentPost, 'id' | 'created_at' | 'views_count'>) {
  try {
    const { data, error } = await supabase
      .from('rent_posts')
      .insert([post])
      .select()
      .single();

    if (error) {
      console.error('Error creating rent post:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createRentPost:', error);
    throw error;
  }
}

export async function updateRentPost(id: string, updates: Partial<RentPost>) {
  try {
    const { data, error } = await supabase
      .from('rent_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating rent post ${id}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateRentPost:', error);
    throw error;
  }
}

export async function deleteRentPost(id: string) {
  try {
    const { error } = await supabase
      .from('rent_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting rent post ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteRentPost:', error);
    throw error;
  }
}
