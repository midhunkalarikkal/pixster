import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/skeletons/NoChatSelected";
import ChatSidebar from "../components/sidebars/ChatSidebar";

const ChatPage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex w-full">
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      <ChatSidebar />
    </div>
  );
};

export default ChatPage;
