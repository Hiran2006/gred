interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-0 transition duration-200"
      />
    </div>
  );
};

export default InputField;
