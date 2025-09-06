import { ChangeEvent } from 'react';
import { FormField } from './FormField';

export type CommonFieldsProps = {
  values: {
    title: string;
    category: string;
    location: string;
    contact_number: string;
    description: string;
  };
  errors?: Partial<Record<'title' | 'category' | 'location' | 'contact_number' | 'description', string>>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  minDescriptionLength: number;
};

export const CommonFields = ({ values, errors = {}, onChange, minDescriptionLength }: CommonFieldsProps) => {
  return (
    <>
      <FormField
        label="Title"
        name="title"
        type="text"
        value={values.title}
        onChange={onChange}
        required
      />
      {errors.title && (
        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
      )}

      <FormField
        label="Category"
        name="category"
        type="text"
        value={values.category}
        onChange={onChange}
        required
      />
      {errors.category && (
        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
      )}

      <FormField
        label="Location"
        name="location"
        type="text"
        value={values.location}
        onChange={onChange}
        required
      />
      {errors.location && (
        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
      )}

      <FormField
        label="Contact Number"
        name="contact_number"
        type="tel"
        value={values.contact_number}
        onChange={onChange}
        required
      />
      {errors.contact_number && (
        <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>
      )}

      <div className="col-span-2">
        <FormField
          label={`Description (${values.description.length}/${minDescriptionLength}+ characters)`}
          name="description"
          type="textarea"
          value={values.description}
          onChange={onChange}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>
    </>
  );
};
