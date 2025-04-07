const StorySkeleton = () => {
  return (
    <div className="w-8/12 h-32">
      <div className="overflow-x-scroll no-scrollbar">
        <div className="flex space-x-2 items-center px-4 py-8 w-max">
          {Array.from({ length: 15 }).map((_, index) => (
            <div key={index} className="h-16 w-16 rounded-full skeleton"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorySkeleton;
