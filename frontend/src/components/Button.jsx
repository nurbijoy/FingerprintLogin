const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 focus:ring-primary-500 shadow-lg hover:shadow-xl disabled:from-primary-300 disabled:to-primary-300 disabled:shadow-none',
    secondary: 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-sm hover:shadow-md disabled:bg-gray-50 disabled:text-gray-400',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-lg hover:shadow-xl disabled:from-red-300 disabled:to-red-300',
    success: 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 focus:ring-green-500 shadow-lg hover:shadow-xl disabled:from-green-300 disabled:to-green-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
