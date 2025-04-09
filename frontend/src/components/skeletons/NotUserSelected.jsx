const NotUserSelected = () => {
  return (
    <div className="w-[70%] h-full items-center justify-center bg-base-100/50 overflow-y-scroll no-scrollbar px-4 py-8">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-1 auto-rows-[192px]">
        {Array.from({ length: 30 }).map((_, index) => {
          const isBig = index % 7 === 0;
          return (
            <div
              key={index}
              className={`skeleton ${
                isBig ? "col-span-2 row-span-2" : ""
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NotUserSelected;
