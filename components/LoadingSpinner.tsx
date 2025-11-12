export default function LoadingSpinner() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-12 flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 font-medium">Crafting your perfect recipe...</p>
    </div>
  );
}

