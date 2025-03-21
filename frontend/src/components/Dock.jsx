import { MessageSquare, Search, Settings, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const Dock = () => {
  return (
    <div className="dock dock-xs flex md:hidden justify-around border-t border-base-300 py-3">
      <Link to={"/"}>
        <button className="dock-active flex flex-col justify-center items-center">
          <MessageSquare />
        </button>
      </Link>

      <Link to={"/profile"}>
        <button className="flex flex-col justify-center items-center">
          <UserRound />
        </button>
      </Link>

      <Link to={"/search"}>
        <button className="flex flex-col justify-center items-center">
          <Search />
        </button>
      </Link>

      <Link to={"/setting"}>
        <button className="flex flex-col justify-center items-center">
          <Settings />
        </button>
      </Link>
    </div>
  );
};

export default Dock;
