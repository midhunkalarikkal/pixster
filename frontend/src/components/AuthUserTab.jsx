import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchStore } from "../store/useSearchStore";

const AuthUserTab = () => {
    
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { getSearchSelectedUser } = useSearchStore();

  const handleUserTabClick = async (userId,e) => {
    e.preventDefault();
    e.stopPropagation();
    await getSearchSelectedUser(userId, navigate);
  };

  return (
    <div className="w-full py-5">
      <div className="flex items-center">
        <button
          onClick={(e) => handleUserTabClick(authUser?._id, e)}
          className={`
              w-full p-2 flex gap-3 items-center
              hover:bg-base-300 transition-colors
            `}
        >
          <div className="relative">
            <img
              src={authUser?.profilePic || "/user_avatar.jpg"}
              alt={"Profile Image"}
              className="size-10 object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex flex-col items-start">
              <p className="font-medium truncate text-sm lg:text-md">{authUser?.fullName}</p>
              <p className="font-light truncate text-sm lg:text-md">{authUser?.userName}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AuthUserTab;
