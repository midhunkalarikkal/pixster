import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { formatMessageTime } from "../../lib/utils";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import MessageSkeleton from "../skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const [isTyping, setIsTyping] = useState(false);
  const [messageSenderId, setMessageSenderId] = useState(null);

  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && (messages || isTyping ) ) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", (data) => {
      const { fromUserId, toUserId } = data;
      if (fromUserId === selectedUser?._id && toUserId === authUser._id) {
        setMessageSenderId(fromUserId);
        setIsTyping(true);
      }
    });

    socket.on("stopTyping", (data) => {
      const { fromUserId, toUserId } = data;
      if (fromUserId === selectedUser?._id && toUserId === authUser._id) {
        setIsTyping(false);
        setMessageSenderId(fromUserId);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, selectedUser]);

  return (
    <div className="w-full md:w-8/12 flex flex-col overflow-auto md:py-6 border-r border-base-300 mt-5 md:mt-0">
      <ChatHeader />
      {isMessagesLoading ? (
        <MessageSkeleton />
      ) : (    
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-6 md:size-8 rounded-full border">
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
              {message.text && (
                <p className="text-[13px] md:text-[15px]">{message.text}</p>
              )}
              <time className="text-[10px] md:text-xs opacity-50 ml-auto">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
          </div>
        ))}
      </div>
      )}

      {isTyping && authUser._id !== messageSenderId && (
        <div className="px-4 pb-1">
          <div className="chat chat-start">
            <div className="chat-bubble flex rounded-md justify-center items-center">
              <p className="text-[13px] md:text-[15px]">Typing</p>
              <span className="loading loading-dots loading-sm ml-2 mt-2"></span>
            </div>
          </div>
        </div>
      )}

      <MessageInput
        setIsTyping={setIsTyping}
        isTyping={isTyping}
        setMessageSenderId={setMessageSenderId}
      />
    </div>
  );
};
export default ChatContainer;
