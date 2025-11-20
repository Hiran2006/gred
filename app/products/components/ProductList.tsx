'use client';

import { useEffect, useState } from 'react';
import { fetchRentPosts } from '../services/rentPostService';
import Image from 'next/image';

type RentPost = {
  id: string;
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

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchRentPosts(statusFilter);
        setPosts(data);
      } catch (error) {
        console.error('Failed to load rent posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [statusFilter]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white w-70 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 bg-gray-100">
              {post.image_urls?.[0] ? (
                <Image 
                  src={post.image_urls[0]} 
                  alt={post.title}
                  className="w-full h-full object-cover"
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
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(post.rent_amount)}</div>
                  {post.deposit_amount > 0 && (
                    <div className="text-xs text-gray-500">Deposit: {formatCurrency(post.deposit_amount)}</div>
                  )}
                </div>
              </div>
              {post.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {post.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {post.category && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {post.category}
                  </span>
                )}
                {post.location && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {post.location}
                  </span>
                )}
              </div>
              <div className="mt-3 flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  {post.is_active ? 'Edit' : 'View'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
