'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchRentPosts } from '../services/rentPostService';
import supabase from '@/lib/supabase/client';
import Image from 'next/image';

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
  image_urls: string[];
  created_at: string;
};

export function ProductList() {
  const [posts, setPosts] = useState<RentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const data = await fetchRentPosts(statusFilter);
        // Filter posts to only show current user's posts
        const userPosts = data.filter(post => post.user_id === userId);
        setPosts(userPosts);
      } catch (error) {
        console.error('Failed to load rent posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [statusFilter, userId]);

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="col-span-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-gray-500">No rental posts found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full mb-6 flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Filter by status:</span>
        <div className="flex space-x-2">
          {['all', 'active', 'inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as 'all' | 'active' | 'inactive')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === statusFilter
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg w-70 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            <div className="relative aspect-video bg-gray-100">
              {post.image_urls?.[0] ? (
                <Image
                  src={post.image_urls[0]} 
                  alt={post.title || 'Property image'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover"
                  priority={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(post.is_active)}`}>
                {post.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
                  {post.title}
                </h3>
                <div className="text-right min-w-max pl-2">
                  <div className="text-base sm:text-lg font-bold text-blue-600 whitespace-nowrap">
                    {formatCurrency(post.rent_amount)}
                  </div>
                  {post.deposit_amount > 0 && (
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      Deposit: {formatCurrency(post.deposit_amount)}
                    </div>
                  )}
                </div>
              </div>
              
              {post.description && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {post.description}
                </p>
              )}
              
              <div className="mt-3 flex flex-wrap gap-2">
                {post.category && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full whitespace-nowrap">
                    {post.category}
                  </span>
                )}
                {post.location && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full line-clamp-1">
                    {post.location}
                  </span>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="text-gray-500 text-xs">
                  {new Date(post.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <Link 
                  href={`/products/edit/${post.id}`}
                  className="px-3 py-1.5 text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
                >
                  {post.is_active ? 'Edit' : 'View'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
