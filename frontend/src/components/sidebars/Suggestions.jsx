import { useEffect } from "react";
import { Users } from "lucide-react";
import AuthUserTab from "../AuthUserTab";
// import { useSearchStore } from "../../store/useSearchStore";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import UserTab from "../../components/UserTab";
import { useSearchStore } from "../../store/useSearchStore";
import { toast } from "react-toastify";
import UserBarSkeleton from "../skeletons/UserBarSkeleton";

const Suggestions = () => {
  // const { sendConnectionRequest } = useSearchStore();
  const { suggestions, suggestionsLoading, fetchSuggestions } =
    useSuggestionStore();
  const { getSearchSelectedUser } = useSearchStore();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handlefollowConnection = (user, e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("Working on it.");
  };

  const handleUserTabClick = (userId) => {
    getSearchSelectedUser(userId);
  };

  console.log("suggestions : ", suggestions);

  return (
    <div className="w-4/12 pr-10 pl-4 overflow-y-scroll no-scrollbar">
      <AuthUserTab />
      <div className="w-full p-3 md:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <label className="cursor-pointer flex items-center gap-2">
            <span className="text-sm">Suggestions for you</span>
          </label>
        </div>
      </div>
      <div className="flex flex-col">
        {suggestionsLoading ? (
          <UserBarSkeleton />
        ) : suggestions && suggestions.length > 0 ? (
          suggestions.map((user) => (
            <UserTab
              key={user._id}
              user={user}
              buttonText="Follow"
              showButton={true}
              onButtonClick={handlefollowConnection}
              onClickUser={handleUserTabClick}
            />
          ))
        ) : (
          <p className="text-center">No suggestions</p>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
