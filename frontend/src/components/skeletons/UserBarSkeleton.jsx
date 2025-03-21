
const UserBarSkeleton = () => {
  return (
    <div className="w-full max-w-md">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="flex w-full flex-col gap-4 border-b border-base-300 px-4 py-3"
        >
          <div className="flex items-center gap-4">
            <div className="skeleton h-14 w-14 shrink-0 rounded-full"></div>

            <div className="flex flex-col gap-2 w-full">
              <div className="skeleton h-4 w-2/3"></div>
              <div className="skeleton h-4 w-4/5"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserBarSkeleton;
