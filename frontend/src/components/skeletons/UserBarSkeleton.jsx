
const UserBarSkeleton = () => {
  return (
    <div className="w-full space-y-2">
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className="flex w-full flex-col gap-4 border-b border-base-300 px-2 py-2 lg:px-4 lg:py-3"
        >
          <div className="flex items-center gap-4">
            <div className="skeleton h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 shrink-0 rounded-full"></div>

            <div className="flex flex-col gap-2 w-full">
              <div className="skeleton h-3 lg:h-5 w-2/3"></div>
              <div className="skeleton h-2 lg:h-4 w-4/5"></div>
            </div>

            <div className="skeleton h-4 w-28 lg:h-6 lg:w-36 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBarSkeleton;
