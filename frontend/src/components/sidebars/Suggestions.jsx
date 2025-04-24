import { useEffect } from "react";
import { Users } from "lucide-react";
import AuthUserTab from "../AuthUserTab";
import UserTab from "../../components/UserTab";
import { useNavigate } from "react-router-dom";
import UserBarSkeleton from "../skeletons/UserBarSkeleton";
import { useSearchStore } from "../../store/useSearchStore";
import { useSuggestionStore } from "../../store/useSuggestionStore";

const Suggestions = () => {

  const navigate = useNavigate();
  const { suggestions, suggestionsLoading, fetchSuggestions, setSuggestions } = useSuggestionStore();
  const { getSearchSelectedUser, sendConnectionRequest } = useSearchStore();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handlefollowConnection = async (user, e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await sendConnectionRequest(user._id, "requested");
    if(res.status === 200) {
      const updatedList = suggestions.filter((item) => item._id !== res.data.userData._id);
      setSuggestions(updatedList);
    }
  };

  const handleUserTabClick = async (userId) => {
    await getSearchSelectedUser(userId, navigate);
  };
  
  return (
    <div className="md:w-4/12 lg:w-4/12 xl:w-4/12 md:pr-2 md:pl-1 lg:pr-10 lg:pl-4 overflow-y-scroll no-scrollbar hidden md:block">
      <AuthUserTab />
      <div className="w-full md:p-3 lg:p-5">
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
