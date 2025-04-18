const PostsSkeleton = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 p-[2px] gap-1">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="skeleton w-auto h-44 md:h-72 lg:h-96"></div>
        ))}
      </div>
    </div>
  );
};

export default PostsSkeleton;
