const NotUserSelected = () => {
  return (
    <div className="w-8/12 h-full flex justify-center">
      <div className="w-10/12 items-center justify-center bg-base-100/50 overflow-y-scroll no-scrollbar px-4 py-8">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-1 auto-rows-[192px]">
          {Array.from({ length: 30 }).map((_, index) => {
            const isBig = index % 7 === 0;
            return (
              <div
                key={index}
                className={`skeleton ${isBig ? "col-span-2 row-span-2" : ""}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NotUserSelected;
