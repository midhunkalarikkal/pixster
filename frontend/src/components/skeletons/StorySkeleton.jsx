const StorySkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className="p-[4px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full inline-block">
        <div className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full skeleton"> </div>
      </div>
      <p className="h-4 w-20 skeleton"></p>
    </div>
  );
};

export default StorySkeleton;
