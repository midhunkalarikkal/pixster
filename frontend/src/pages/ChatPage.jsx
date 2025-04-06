import { useChatStore } from '../store/useChatStore';
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';
import RightSidebar from '../components/sidebars/RightSidebar';

const ChatPage = () => {
    const { selectedUser } = useChatStore();

    return (
      <div className="h-screen bg-base-200">
        <div className="flex items-center justify-center pt-16">
          <div className="bg-base-200 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer /> }
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
    )
}

export default ChatPage