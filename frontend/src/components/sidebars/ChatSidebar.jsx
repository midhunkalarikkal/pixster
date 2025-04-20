import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import AuthUserTab from "../AuthUserTab";

const ChatSidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getLastMessage,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);

    if (
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear()
    ) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      const day = messageDate.getDate().toString().padStart(2, "0");
      const month = (messageDate.getMonth() + 1).toString().padStart(2, "0");
      const year = messageDate.getFullYear().toString().slice(2);
      return `${day}/${month}/${year}`;
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`h-full w-full md:w-4/12 bg-base-100 flex flex-col transition-all duration-200 px-2 sticky ${
        selectedUser ? "hidden md:block" : "block"
      }`}
    >
      <AuthUserTab />

      <div className="border-b border-base-300 w-full p-3 md:p-5">
        <div className="lg:flex items-center gap-2 space-y-2">
          <Users className="size-6" />
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-sm text-zinc-500 mt-1">
            ({onlineUsers?.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-1 flex-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-2 flex gap-3 items-center border-b border-base-300
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "" : ""}
            `}
          >
            <div className="relative w-2/12">
              <img
                src={user.profilePic || "/user_avatar.jpg"}
                alt={user.name}
                className="size-8 lg:size-10 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            <div className="w-10/12">
              <div className="flex justify-between">
                <p className="font-medium truncate text-sm lg:text-md">{user.fullName}</p>
                {getLastMessage(user._id) && (
                  <p className="text-xs truncate mt-1 ">
                    {formatDate(getLastMessage(user._id)?.date)}
                  </p>
                )}
              </div>
              <div className="flex text-sm lg:text-md text-stone-500">
                {getLastMessage(user._id) ? (
                  <p className="font-normal truncate">
                    {getLastMessage(user._id)?.message}
                  </p>
                ) : onlineUsers.includes(user._id) ? (
                  "Online"
                ) : (
                  "Offline"
                )}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default ChatSidebar;
