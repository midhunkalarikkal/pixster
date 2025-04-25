import { useEffect } from "react";
import SuggestionCard from "../SuggestionCard";
import { useNavigate } from "react-router-dom";
import { useSearchStore } from "../../store/useSearchStore";
import { useSuggestionStore } from "../../store/useSuggestionStore";
import SuggestionCardSkeletion from "../skeletons/SuggestionCardSkeletion";

const HorizontalScrollingSuggestion = () => {
  const navigate = useNavigate();
  const { suggestions, suggestionsLoading, fetchSuggestions, setSuggestions } =
    useSuggestionStore();
  const { getSearchSelectedUser, sendConnectionRequest } = useSearchStore();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handlefollowConnection = async (user, e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await sendConnectionRequest(user._id, "requested");
    if (res.status === 200) {
      const updatedList = suggestions.filter(
        (item) => item._id !== res.data.userData._id
      );
      setSuggestions(updatedList);
    }
  };

  const handleUserTabClick = async (userId) => {
    await getSearchSelectedUser(userId, navigate);
  };

    if(!suggestions || suggestions.length === 0) {
      return null;
    }

  return (
    <div className="w-full md:hidden p-2">
      <h3 className="my-3 text-md font-semibold">Pixster suggested for you</h3>
      <div className="overflow-x-scroll no-scrollbar">
        <div className="flex space-x-2">
          {suggestionsLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <SuggestionCardSkeletion key={index} />
              ))
            : suggestions &&
              suggestions.length > 0 &&
              suggestions.map((user) => (
                <SuggestionCard
                  key={user._id}
                  user={user}
                  buttonText="Follow"
                  showButton={true}
                  onButtonClick={handlefollowConnection}
                  onClickUser={handleUserTabClick}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalScrollingSuggestion;
