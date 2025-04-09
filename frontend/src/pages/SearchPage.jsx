import SearchSidebar from "../components/sidebars/SearchSidebar";
import NotUserSelected from "../components/skeletons/NotUserSelected";

const SearchPage = () => {
  return (
    <div className="flex bg-base-100 w-[84%] h-screen">
      <NotUserSelected />
      <SearchSidebar />
    </div>
  );
};

export default SearchPage;
