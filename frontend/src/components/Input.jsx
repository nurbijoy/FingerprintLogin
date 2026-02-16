const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '',
  required = false,
  error = '',
  className = '',
  name
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      />
      {error && <p className="mt-1.5 text-sm text-red-600 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>}
    </div>
  );
};

export default Input;
