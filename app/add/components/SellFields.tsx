import { ChangeEvent } from 'react';
import { FormField } from './FormField';

export type SellFieldsProps = {
  values: {
    price: string;
  };
  errors?: Partial<Record<'price', string>>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const SellFields = ({ values, errors = {}, onChange }: SellFieldsProps) => {
  return (
    <div>
      <FormField
        label="Price (₹)"
        name="price"
        type="number"
        value={values.price}
        onChange={onChange}
        min={0}
        step={1000}
        required
      />
      {errors.price && (
        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
      )}
    </div>
  );
};
