import AuthUserTab from "../AuthUserTab";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../../store/useSearchStore";
import UserBarSkeleton from "../skeletons/UserBarSkeleton";

const SearchSidebar = () => {

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { getSearchUsers, searchLoading, searchedUsers, getSearchSelectedUser } = useSearchStore();

  useEffect(() => {
    if (searchQuery === "") return;
    const timer = setTimeout(() => {
      getSearchUsers(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, getSearchUsers]);

  const handleUserTabClick = async (userId,e) => {
    e.preventDefault();
    e.stopPropagation();
    await getSearchSelectedUser(userId, navigate);
  };

  return (
    <aside
      className={`h-full w-full md:w-4/12 flex flex-col transition-all duration-200 px-2`}
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

      <div className="overflow-y-auto w-full md:py-1 flex-1 no-scrollbar">
        {searchLoading ? (
          <UserBarSkeleton />
        ) : searchedUsers && searchedUsers.length > 0 ? (
          searchedUsers.map((user) => (
            <button
               key={user._id}
               onClick={(e) => handleUserTabClick(user._id, e)}
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
    </aside>
  );
};

export default SearchSidebar;
