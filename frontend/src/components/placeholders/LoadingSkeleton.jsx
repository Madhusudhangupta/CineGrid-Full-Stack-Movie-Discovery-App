
export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
    </div>
  );
}