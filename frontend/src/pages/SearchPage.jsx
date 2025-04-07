import SearchSidebar from "../components/sidebars/SearchSidebar";
import SearchSelectedUser from "../components/SearchSelectedUser";

const SearchPage = () => {
  return (
    <div className="flex h-screen w-full bg-base-100">
      <SearchSelectedUser />
      <SearchSidebar />
    </div>
  );
};

export default SearchPage;
