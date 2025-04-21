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
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  const { setSearchSelectedUserNull, getSearchSelectedUser } = useSearchStore();

  const handleUserTabClick = async (userId,e) => {
    e.preventDefault();
    e.stopPropagation();
    await getSearchSelectedUser(userId, navigate);
  };

  return (
    <aside className="bg-base-100 border-r border-base-300 md:w-1/12 lg:w-2/12 z-40 backdrop-blur-lg h-full p-4 hidden md:block sticky">
      {authUser && (
        <div className="flex flex-col items-center justify-between space-y-6 gap-2 h-full">
          <div className=" flex flex-col space-y-4 items-center lg:items-start">
            
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all ml-4 my-6"
            >
              <h3 className="text-2xl font-bold italic hidden lg:block">Pixster</h3>
              <h3 className="text-2xl font-bold italic block lg:hidden">P</h3>
            </Link>

            <Link to={"/"} className={`flex btn bg-base-100 border-0`}>
              <Home className="size-6" />
              <span className="hidden lg:block">Home</span>
            </Link>

            <button
              className={`flex btn bg-base-100 border-0`}
              onClick={(e) => handleUserTabClick(authUser._id, e)}
            >
              <img src={authUser.profilePic || '/user_avatar.jpg'} className="size-6 rounded-full"/>
              <span className="hidden lg:block">Profile</span>
            </button>

            <Link to={"/chat"} className={`flex btn bg-base-100 border-0`}>
              <MessageCircle className="size-6" />
              <span className="hidden lg:block">Chat</span>
            </Link>

            <Link
              to={"/createPost"}
              className={`flex btn bg-base-100 border-0`}
            >
              <PlusSquare className="size-6" />
              <span className="hidden lg:block">Create</span>
            </Link>

            <Link to={"/search"} className={`flex btn bg-base-100 border-0`}>
              <Search className="size-6" />
              <span className="hidden lg:block">Search</span>
            </Link>

            <Link
              to={"/notifications"}
              onClick={() => setSearchSelectedUserNull()}
              className={`flex btn bg-base-100 border-0`}
            >
              <BellIcon className="size-6" />
              <span className="hidden lg:block">Notifications</span>
            </Link>

            <Link to={"/settings"} className={`flex btn bg-base-100 border-0`}>
              <Settings className="size-6" />
              <span className="hidden lg:block">Settings</span>
            </Link>
          </div>

          <div className="">
            <button className="flex btn bg-base-100 border-0" onClick={logout}>
              <LogOut className="size-6" />
              <span className="hidden lg:block">Logout</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Navbar;
