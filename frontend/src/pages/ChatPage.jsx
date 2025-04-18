import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/skeletons/NoChatSelected";
import ChatSidebar from "../components/sidebars/ChatSidebar";

const ChatPage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex md:w-1/12 lg:w-10/12">
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      <ChatSidebar />
    </div>
  );
};

export default ChatPage;
