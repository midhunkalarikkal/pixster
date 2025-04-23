import { Users } from "lucide-react";
import AuthUserTab from "../AuthUserTab";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDate } from "../../utils/helpers";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";

const ChatSidebar = () => {

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    getLastMessage,
    setLastMessage,
  } = useChatStore();

  const { onlineUsers, setOnlineUsers, socket } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const filteredUsers = useMemo(() => {
    return showOnlineOnly
      ? users.filter((user) => onlineUsers.includes(user._id))
      : users;
  }, [showOnlineOnly, users, onlineUsers]);

  const handleOnlineUsers = useCallback((userIds) => {
    setOnlineUsers(userIds);
  }, [setOnlineUsers]);

  useEffect(() => {
    getUsers();
    socket?.on("getOnlineUsers", handleOnlineUsers);
    return () => socket?.off("getOnlineUsers", handleOnlineUsers);
  }, [getUsers, socket, handleOnlineUsers]);

  useEffect(() => {
    const setNewMessage = (message) => {
      setLastMessage(message.senderId, message.text ?  message.text : "Image", message.createdAt );
    };
    socket?.on("newMessage", setNewMessage);
    return () => socket?.off("newMessage", setNewMessage);
  }, [socket]);

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
            <div className="relative w-fit">
              <img
                src={user.profilePic || "/user_avatar.jpg"}
                alt={user.name}
                className="size-10 object-cover rounded-full"
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
                  <p className="font-normal truncate text-base-content">
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
