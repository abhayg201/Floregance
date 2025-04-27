import LoadingSpinner from "./LoadingSpinner";

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
