import ChatHeader from "./ChatHeader";
import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../lib/utils";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import MessageSkeleton from "./skeletons/MessageSkeleton";


const ChatContainer = () => {
  
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto px-4 py-8 w-9/12">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="w-8/12 flex flex-col overflow-auto py-6 border-r border-base-300">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-6 md:size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/user_avatar.jpg"
                      : selectedUser.profilePic || "/user_avatar.jpg"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-bubble flex flex-col rounded-md">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
                {message.text && <p className="text-[13px] md:text-[15px]">{message.text}</p>}
                <time className="text-[10px] md:text-xs opacity-50 ml-auto">{formatMessageTime(message.createdAt)}</time>
            </div>

          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;