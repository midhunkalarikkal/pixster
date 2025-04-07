const NotUserSelected = () => {
  return (
    <div className="w-full hidden lg:flex flex-1 flex-col items-center justify-center bg-base-100/50">
      <div className="grid grid-cols-4">
        {Array.from({ length: 24}).map((_, index) => (
          <div key={index} className="h-48 w-48 skeleton m-[1px]">
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotUserSelected;
