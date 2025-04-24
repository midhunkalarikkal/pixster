
const SuggestionCardSkeletion = () => {
  return (
    <div className="bg-base-200 flex flex-col h-52 w-48 justify-center items-center rounded-md shadow-md px-6">
      <div className="bg-base-100 rounded-full">
        <div className="w-24 h-24 rounded-full skeleton"></div>
      </div>
      <div className="flex flex-col justify-center items-center mt-4 space-y-4">
        <div className="h-3 w-full skeleton"></div>
        <button className="btn- btn-sm skeleton w-36 h-4 rounded-md">
          Follow
        </button>
      </div>
    </div>
  );
};

export default SuggestionCardSkeletion;
