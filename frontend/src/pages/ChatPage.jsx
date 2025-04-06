import { useChatStore } from "../store/useChatStore";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";
import RightSidebar from "../components/sidebars/RightSidebar";

const ChatPage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex w-[84%]">
      {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      <RightSidebar />
    </div>
  );
};

export default ChatPage;
