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
  children,
}: FormFieldProps) => {
  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent';

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children || (
        rows ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClass}
            placeholder={placeholder}
            required={required}
            rows={rows}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={inputClass}
            placeholder={placeholder}
            required={required}
          />
        )
      )}
    </div>
  );
};
