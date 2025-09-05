import React from "react";

const Shimmer = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-64 bg-gray-700"></div>
          <div className="p-2">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Shimmer;
