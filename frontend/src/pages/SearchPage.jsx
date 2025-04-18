import MediaGrid from "../components/MediaGrid";
import SearchSidebar from "../components/sidebars/SearchSidebar";

const SearchPage = () => {
  return (
    <div className="md:flex bg-base-100 w-full md:w-11/12 lg:w-10/12 h-[88%] md:h-full mt-10 md:mt-0">
      <MediaGrid />
      <SearchSidebar />
    </div>
  );
};

export default SearchPage;
