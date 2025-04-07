import SearchSidebar from "../components/sidebars/SearchSidebar";
import SearchSelectedUser from "../components/SearchSelectedUser";

const SearchPage = () => {
  return (
    <div className="flex h-screen bg-base-100 w-[84%]">
      <SearchSelectedUser />
      <SearchSidebar />
    </div>
  );
};

export default SearchPage;
