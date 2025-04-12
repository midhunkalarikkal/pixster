const StorySkeleton = () => {
  return (
    <div
      className="p-[4px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full inline-block"
    >
      <div className="h-20 w-20 rounded-full skeleton"> </div>
    </div>
  );
};

export default StorySkeleton;
