import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchStore } from "../../store/useSearchStore";
import {
  Home,
  LogOut,
  PlusSquare,
  Search,
} from "lucide-react";

const MobileBottomBar = () => {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  const { getSearchSelectedUser } = useSearchStore();

  const handleProfileClick = async (userId ,e) => {
    e.preventDefault();
    await getSearchSelectedUser(userId);
    navigate("/profile");
  };

  return (
    <footer className="bg-base-100 w-full z-40 backdrop-blur-lg md:hidden fixed bottom-0 h-[6%]">
      {authUser && (
        <div className="flex justify-around">
          <button className="btn bg-base-100 border-0" onClick={logout}>
            <LogOut className="size-5" />
          </button>

          <Link to={"/"} className={`btn bg-base-100 border-0`}>
            <Home className="size-5" />
          </Link>

          <Link to={"/createPost"} className={`btn bg-base-100 border-0`}>
            <PlusSquare className="size-5" />
          </Link>

          <Link to={"/search"} className={`btn bg-base-100 border-0`}>
            <Search className="size-5" />
          </Link>

          <button
            className={`btn bg-base-100 border-0`}
            onClick={(e) => handleProfileClick(authUser._id, e)}
          >
            <img src={authUser?.profilePic || "/user_avatar.jpg"} className="size-6 rounded-full"/>
          </button>
        </div>
      )}
    </footer>
  );
};

export default MobileBottomBar;
