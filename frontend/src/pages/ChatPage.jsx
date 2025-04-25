import { useChatStore } from "../store/useChatStore";
import ChatSidebar from "../components/sidebars/ChatSidebar";
import ChatContainer from "../components/chat/ChatContainer";
import NoChatSelected from "../components/skeletons/NoChatSelected";

const ChatPage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex w-full md:w-11/12 lg:w-10/12 h-[88%] md:h-full mt-10 md:mt-0">
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      <ChatSidebar />
    </div>
  );
};

export default ChatPage;
