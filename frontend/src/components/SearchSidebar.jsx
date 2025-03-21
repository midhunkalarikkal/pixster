import { useSearchStore } from "../store/useSearchStore";
import Dock from "./Dock";

const SearchSidebar = () => {
  const { searchSelectedUser } = useSearchStore();
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className={`h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 px-2 ${
        searchSelectedUser ? "hidden lg:block" : "block"
      }`}
    >
      <div className="border-b border-base-300 w-full p-2 md:p-5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by username"
            className="input w-full h-10 md:h-12"
          />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-1 flex-1">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
      <Dock />
    </aside>
  );
};

export default SearchSidebar;
