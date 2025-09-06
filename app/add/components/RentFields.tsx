import { ChangeEvent } from 'react';
import { FormField } from './FormField';

export type RentFieldsProps = {
  values: {
    rent_amount: string;
    deposit_amount: string;
  };
  errors?: Partial<Record<'rent_amount' | 'deposit_amount', string>>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const RentFields = ({ values, errors = {}, onChange }: RentFieldsProps) => {
  return (
    <>
      <div>
        <FormField
          label="Rent Amount (₹)"
          name="rent_amount"
          type="number"
          value={values.rent_amount}
          onChange={onChange}
          min={0}
          step={100}
          required
        />
        {errors.rent_amount && (
          <p className="mt-1 text-sm text-red-600">{errors.rent_amount}</p>
        )}
      </div>

      <div>
        <FormField
          label="Deposit Amount (₹)"
          name="deposit_amount"
          type="number"
          value={values.deposit_amount}
          onChange={onChange}
          min={0}
          step={1000}
        />
        {errors.deposit_amount && (
          <p className="mt-1 text-sm text-red-600">{errors.deposit_amount}</p>
        )}
      </div>
    </>
  );
};
