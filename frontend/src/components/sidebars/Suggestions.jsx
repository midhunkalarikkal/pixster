import { useEffect } from "react";
import { Users } from "lucide-react";
import AuthUserTab from "../AuthUserTab";
// import { useSearchStore } from "../../store/useSearchStore";
import { useSuggestionStore } from '../../store/useSuggestionStore';

const Suggestions = () => {

  // const { sendConnectionRequest } = useSearchStore();
  const { suggestions, suggestionsLoading, fetchSuggestions } = useSuggestionStore();

  useEffect(() => {
    fetchSuggestions();
  },[])

  return (
    <div className="w-4/12 pr-10 pl-4">
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
          suggestions.map((suggestion, index) => {
            <p key={index}>{`user ${index}`}</p>
          })
        ) : (
          <p className="text-center">No suggestions</p>
        )
      }
    </div>
  )
}

export default Suggestions