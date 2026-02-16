const LoadingSpinner = ({ size = 'md', message = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className={`${sizes[size]} border-primary-200 rounded-full`}></div>
        <div className={`${sizes[size]} border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
      {message && <p className="mt-4 text-gray-600 font-medium animate-pulse-slow">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
