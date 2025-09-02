"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import BottomNavbar from "@/components/nav bar/BottomNavigation";
import { FormField, PropertyTypeToggle, ImageUploader } from "./components";

interface FormErrors {
  title?: string;
  category?: string;
  rent_amount?: string;
  deposit_amount?: string;
  price?: string;
  location?: string;
  contact_number?: string;
  description?: string;
  images?: string;
  tags?: string;
  is_active?: string;
}

const PHONE_REGEX = /^[0-9]{10}$/;
const MIN_DESCRIPTION_LENGTH = 20;

export default function AddProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Common fields
    title: "",
    description: "",
    listingType: "rent" as "rent" | "sell",
    category: "",
    location: "",
    contact_number: "",
    tags: [] as string[],
    images: [] as string[],
    is_active: true,
    
    // Rent specific
    rent_amount: "",
    deposit_amount: "",
    
    // Sell specific
    price: "",
  });
  
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Common validations
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    // Type-specific validations
    if (formData.listingType === 'rent') {
      if (!formData.rent_amount) {
        newErrors.rent_amount = 'Rent amount is required';
      } else if (isNaN(Number(formData.rent_amount)) || Number(formData.rent_amount) <= 0) {
        newErrors.rent_amount = 'Please enter a valid rent amount';
      }
      
      if (formData.deposit_amount && isNaN(Number(formData.deposit_amount))) {
        newErrors.deposit_amount = 'Please enter a valid deposit amount';
      }
    } else {
      if (!formData.price) {
        newErrors.price = 'Price is required';
      } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        newErrors.price = 'Please enter a valid price';
      }
    }
    
    if (!formData.contact_number) {
      newErrors.contact_number = 'Contact number is required';
    } else if (!PHONE_REGEX.test(formData.contact_number)) {
      newErrors.contact_number = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.description || formData.description.length < MIN_DESCRIPTION_LENGTH) {
      newErrors.description = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters long`;
    }
    
    if (formData.listingType === 'rent') {
      if (!formData.rent_amount) {
        newErrors.rent_amount = 'Rent amount is required';
      } else if (parseFloat(formData.rent_amount) <= 0) {
        newErrors.rent_amount = 'Rent amount must be greater than 0';
      }
    } else {
      if (!formData.price) {
        newErrors.price = 'Price is required';
      } else if (parseFloat(formData.price) <= 0) {
        newErrors.price = 'Price must be greater than 0';
      }
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'Please upload at least one image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddTag = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      setTagInput("");
    }
  }, [tagInput, formData.tags]);
  
  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (files: FileList) => {
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const baseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        contact_number: formData.contact_number,
        tags: formData.tags,
        images: formData.images,
        is_active: formData.is_active,
      };
      
      const endpoint = formData.listingType === 'rent' ? '/api/rent-posts' : '/api/sell-posts';
      const postData = formData.listingType === 'rent'
        ? {
            ...baseData,
            rent_amount: parseFloat(formData.rent_amount),
            deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : 0,
          }
        : {
            ...baseData,
            price: parseFloat(formData.price),
          };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit property');
      }
      
      toast.success('Property listed successfully!');
      router.push('/home');
    } catch (error) {
      console.error('Error submitting property:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to list property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (type: "rent" | "sell") => {
    setFormData((prev) => ({
      ...prev,
      listingType: type,
      rent_amount: type === 'sell' ? '' : prev.rent_amount,
      price: type === 'rent' ? '' : prev.price,
      deposit_amount: type === 'sell' ? '' : prev.deposit_amount,
    }));
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Add New Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PropertyTypeToggle
            listingType={formData.listingType}
            onTypeChange={(type) => setFormData(prev => ({
              ...prev,
              listingType: type,
              rent_amount: type === 'sell' ? '' : prev.rent_amount,
              price: type === 'rent' ? '' : prev.price,
              deposit_amount: type === 'sell' ? '' : prev.deposit_amount,
            }))}
          />
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              label="Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            
            <FormField
              label="Category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
            />
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            
            {formData.listingType === 'rent' ? (
              <>
                <div>
                  <FormField
                    label="Rent Amount (₹)"
                    name="rent_amount"
                    type="number"
                    value={formData.rent_amount}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    required
                  />
                  {errors.rent_amount && <p className="mt-1 text-sm text-red-600">{errors.rent_amount}</p>}
                </div>
                
                <div>
                  <FormField
                    label="Deposit Amount (₹)"
                    name="deposit_amount"
                    type="number"
                    value={formData.deposit_amount}
                    onChange={handleChange}
                    min="0"
                    step="1000"
                  />
                  {errors.deposit_amount && <p className="mt-1 text-sm text-red-600">{errors.deposit_amount}</p>}
                </div>
              </>
            ) : (
              <div>
                <FormField
                  label="Price (₹)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  required
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>
            )}
            
            <FormField
              label="Location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            
            <FormField
              label="Contact Number"
              name="contact_number"
              type="tel"
              value={formData.contact_number}
              onChange={handleChange}
              required
            />
            {errors.contact_number && <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>}
            
            <div className="col-span-2">
              <FormField
                label={`Description (${formData.description.length}/${MIN_DESCRIPTION_LENGTH}+ characters)`}
                name="description"
                type="textarea"
                value={formData.description}
                onChange={handleChange}
                required
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (press Enter to add)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="e.g. Furnished, Parking, Balcony"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-amber-400 hover:bg-amber-200 hover:text-amber-500 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ImageUploader
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
            images={formData.images}
          />

          <div className="pt-4 border-t border-gray-200 mt-6">
            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 text-sm sm:text-base font-medium flex items-center justify-center"
              disabled={isSubmitting || formData.images.length === 0}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : formData.images.length === 0 ? (
                'Add at least one image'
              ) : (
                'Add Property'
              )}
            </button>
            {errors.images && <p className="mt-2 text-sm text-red-600 text-center">{errors.images}</p>}
          </div>
        </form>
      </div>
      <BottomNavbar />
    </div>
  );
}
