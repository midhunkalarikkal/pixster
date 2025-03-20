import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2 md:p-2.5 border-b border-base-300 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          <div className="avatar">
            <div className="size-8 md:size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/user_avatar.jpg"} alt={selectedUser.fullName} />
            </div>
          </div>

          <div>
            <h3 className="text-xs md:text-sm font-medium">{selectedUser.fullName}</h3>
            <p className="text-xs md:text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>

        </div>

        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>

      </div>
    </div>
  );
};
export default ChatHeader;