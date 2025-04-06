import { LogOut, MessageCircle, Search, Settings, User } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";

const Navbar = () => {

  const { logout, authUser } = useAuthStore();
  
  return (
    <aside className="bg-base-100 border-r border-base-300 w-[16%] z-40 backdrop-blur-lg h-full p-4 hidden md:block sticky">
      <div className="flex justify-center h-[10%]">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <h3 className="text-2xl font-bold italic">Talkzy</h3>
        </Link>
      </div>

      {authUser && (
        <div className="flex flex-col items-center justify-between space-y-6 gap-2 h-[90%]">

          <div className=" flex flex-col space-y-4">

            <Link to={"/profile"} className={`btn btn-sm gap-2 transition-colors hidden md:flex`}>
              <User className="size-5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            <Link to={"/chat"} className={`btn btn-sm gap-2 transition-colors hidden md:flex`}>
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </Link>

            <Link
              to={"/search"}
              className={`btn btn-sm gap-2 transition-colors hidden md:flex`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>

            <Link
              to={"/notifications"}
              className={`btn btn-sm gap-2 transition-colors hidden md:flex`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </Link>

            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors hidden md:flex items-center`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>

          <div className="">
            <button className="btn btn-sm flex gap-2 items-center" onClick={logout}>
              <LogOut className="size-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>
      )}
    </aside>
  );
};

export default Navbar;
