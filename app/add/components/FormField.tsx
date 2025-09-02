import { ChangeEvent, ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  min?: string | number;
  step?: string | number;
  children?: ReactNode;
};

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  rows,
  min,
  step,
  children,
}: FormFieldProps) => {
  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent';

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      {children || (
        type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            rows={rows || 3}
            value={value}
            onChange={onChange}
            className={inputClass}
            placeholder={placeholder}
            required={required}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={inputClass}
            placeholder={placeholder}
            required={required}
            min={type === 'number' ? min : undefined}
            step={type === 'number' ? step : undefined}
          />
        )
      )}
    </div>
  );
};
