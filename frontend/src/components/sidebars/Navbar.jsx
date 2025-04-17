import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchStore } from "../../store/useSearchStore";
import {
  BellIcon,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  Settings,
  User,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  const { setSearchSelectedUserNull, getSearchSelectedUser } = useSearchStore();

  return (
    <aside className="bg-base-100 border-r border-base-300 w-2/12 z-40 backdrop-blur-lg h-full p-4 hidden md:block sticky">
      {authUser && (
        <div className="flex flex-col items-center justify-between space-y-6 gap-2 h-full">
          <div className=" flex flex-col space-y-4 items-start">
            
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all ml-4 my-6"
            >
              <h3 className="text-2xl font-bold italic">Talkzy</h3>
            </Link>

            <Link to={"/"} className={`flex btn bg-base-100 border-0`}>
              <Home className="size-5" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <button
              className={`flex btn bg-base-100 border-0`}
              onClick={() => getSearchSelectedUser(authUser._id, navigate)}
            >
              <User className="size-5" />
              <span className="hidden sm:inline">Profile</span>
            </button>

            <Link to={"/chat"} className={`flex btn bg-base-100 border-0`}>
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
            </Link>

            <Link
              to={"/createPost"}
              className={`flex btn bg-base-100 border-0`}
            >
              <PlusSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </Link>

            <Link to={"/search"} className={`flex btn bg-base-100 border-0`}>
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>

            <Link
              to={"/notifications"}
              onClick={() => setSearchSelectedUserNull()}
              className={`flex btn bg-base-100 border-0`}
            >
              <BellIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </Link>

            <Link to={"/settings"} className={`flex btn bg-base-100 border-0`}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>

          <div className="">
            <button className="flex btn bg-base-100 border-0" onClick={logout}>
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
