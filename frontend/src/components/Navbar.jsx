import { LogOut, MessageSquare, Search, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <h3 className="text-2xl font-bold italic">Talkzy</h3>
            </Link>
          </div>

          {authUser && (
            <div className="flex items-center gap-2">
              <Link
                to={"/"}
                className={`
              btn btn-sm gap-2 transition-colors hidden md:flex
              
              `}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </Link>

              <Link
                to={"/profile"}
                className={`btn btn-sm gap-2 hidden md:flex`}
              >
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <Link
                to={"/search"}
                className={`
              btn btn-sm gap-2 transition-colors hidden md:flex
              
              `}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </Link>

              <Link
                to={"/settings"}
                className={`
              btn btn-sm gap-2 transition-colors hidden md:flex
              
              `}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
