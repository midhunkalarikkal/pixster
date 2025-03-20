const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="w-full text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative w-8/12 space-y-2">
            <div className="chat chat-start">
              <div className="chat-bubble skeleton w-56 h-16 rounded-md"></div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble skeleton w-64 rounded-md"></div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble skeleton w-60 h-20 rounded-md"></div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble skeleton w-56 h-16 rounded-md"></div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Welcome to Talkzy!</h2>
        <p className="text-base-content/60">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
