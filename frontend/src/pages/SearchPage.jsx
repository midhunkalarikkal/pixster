import SearchSidebar from "../components/sidebars/SearchSidebar";
import NotUserSelected from "../components/skeletons/NotUserSelected";

const SearchPage = () => {
  return (
    <div className="flex h-screen bg-base-100 w-[84%]">
      <NotUserSelected />
      <SearchSidebar />
    </div>
  );
};

export default SearchPage;
