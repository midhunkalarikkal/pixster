import Dock from "../Dock";
import { useEffect, useState } from "react";
import AuthUserTab from "../AuthUserTab";
import { useSearchStore } from "../../store/useSearchStore";
import { useNavigate } from "react-router-dom";

const SearchSidebar = () => {

  const navigate = useNavigate();
  const skeletonContacts = Array(8).fill(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { getSearchUsers, searchLoading, searchedUsers, getSearchSelectedUser, searchSelectedUser } = useSearchStore();

  useEffect(() => {
    if (searchQuery === "") return;
    const timer = setTimeout(() => {
      getSearchUsers(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, getSearchUsers]);

  return (
    <aside
      className={`h-full w-[30%] flex flex-col transition-all duration-200 px-2 ${
        searchSelectedUser ? "hidden lg:block" : "block"
      }`}
    >
      <AuthUserTab />

      <div className="border-b border-t border-base-300 w-full py-3">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search users"
            className="input w-full h-10 md:h-12 border-2 border-base-300 focus:outline-none focus:border-base-300"
            value={searchQuery || ""}
            onInput={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto w-full py-1 flex-1">
        {searchLoading ? (
          skeletonContacts.map((_, idx) => (
            <div key={idx} className="w-full p-3 flex items-center gap-3">
              <div className="relative mx-auto lg:mx-0">
                <div className="skeleton size-12 rounded-full" />
              </div>

              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="skeleton h-4 w-32 mb-2" />
                <div className="skeleton h-3 w-16" />
              </div>
            </div>
          ))
        ) : searchedUsers && searchedUsers.length > 0 ? (
          searchedUsers.map((user) => (
            <button
               key={user._id}
               onClick={() => getSearchSelectedUser(user._id, navigate)}
               className={` w-full p-2 flex gap-3 items-center
               hover:bg-base-300 transition-colors border-b border-base-300`}
             >
               <div className="relative w-2/12">
                 <img
                   src={user.profilePic || "/user_avatar.jpg"}
                   alt={user.name}
                   className="size-10 object-cover rounded-full"
                 />
               </div>
         
               <div className="w-10/12">
                 <div className="flex justify-between">
                   <p className="font-medium truncate">{user.fullName}</p>
                 </div>
                 <div className="text-sm flex">
                   <p className="font-normal truncate text-stone-500">{user.userName}</p>
                 </div>
               </div>
             </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">
            {searchQuery ? "No users found" : "Search users"}
          </div>
        )}
      </div>

      <Dock />
    </aside>
  );
};

export default SearchSidebar;
