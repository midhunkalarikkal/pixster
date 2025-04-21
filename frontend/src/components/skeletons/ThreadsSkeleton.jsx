const ThreadsSkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-[2px] gap-1">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="skeleton w-auto h-36"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ThreadsSkeleton;
