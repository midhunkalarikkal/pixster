import UserTab from "./UserTab";
import { Users } from "lucide-react";
import AuthUserTab from "./AuthUserTab";
import { useConnectionStore } from '../store/useConnectionStore';
import { useSuggestionStore } from '../store/useSuggestionStore';
import { useEffect } from "react";

const Suggestions = () => {

  const { sendConnectionRequest } = useConnectionStore();
  const { suggestions, suggestionsLoading, fetchSuggestions } = useSuggestionStore();

  console.log("suggestions : ",suggestions);
  useEffect(() => {
    fetchSuggestions();
  },[])

  return (
    <div className="w-[40%] pr-10">
      <AuthUserTab />
      <div className="w-full p-3 md:p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <label className="cursor-pointer flex items-center gap-2">
            <span className="text-sm">Suggestions for you</span>
          </label>
        </div>
      </div>
      {
        suggestionsLoading ? (
          <p>Loading</p>
        ) : suggestions ? (
          suggestions.map((suggestion) => {
            <UserTab
            key={suggestion._id} 
            sendConnection={() => sendConnectionRequest(suggestion._id, "requested" )} />
          })
        ) : (
          <p className="text-center">No suggestions</p>
        )
      }
    </div>
  )
}

export default Suggestions