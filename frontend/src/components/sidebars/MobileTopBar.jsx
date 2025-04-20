import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchStore } from "../../store/useSearchStore";
import { BellIcon, MessageCircle, Settings } from "lucide-react";

const MobileTopBar = () => {
  const { authUser } = useAuthStore();
  const { setSearchSelectedUserNull } = useSearchStore();

  return (
    <header className="bg-base-100 w-full z-40 backdrop-blur-lg md:hidden fixed top-0 h-[6%]">
      {authUser && (
        <div className="flex">          
          <div className="w-6/12">
            <Link to={"/"} className={`btn bg-base-100 border-0`}>
              <h3 className="text-xl font-bold italic">
                Pixster
              </h3>
            </Link>
          </div>

          <div className="w-6/12 flex justify-end">
            <Link to={"/chat"} className={`btn bg-base-100 border-0`}>
              <MessageCircle className="size-5" />
            </Link>

            <Link
              to={"/notifications"}
              onClick={() => setSearchSelectedUserNull()}
              className={`btn bg-base-100 border-0`}
            >
              <BellIcon className="size-5" />
            </Link>

            <Link to={"/settings"} className={`btn bg-base-100 border-0`}>
              <Settings className="size-5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileTopBar;
