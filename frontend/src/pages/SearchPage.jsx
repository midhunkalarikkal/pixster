import SearchSidebar from '../components/SearchSidebar';
import SearchSelectedUser from '../components/SearchSelectedUser';

const SearchPage = () => {
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16">
        <div className="bg-base-200 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SearchSidebar />
            <SearchSelectedUser />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage