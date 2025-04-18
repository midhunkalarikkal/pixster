import MediaGrid from "../components/MediaGrid";
import SearchSidebar from "../components/sidebars/SearchSidebar";

const SearchPage = () => {
  return (
    <div className="flex bg-base-100 md:w-11/12 lg:w-10/12 h-screen">
      <MediaGrid />
      <SearchSidebar />
    </div>
  );
};

export default SearchPage;
