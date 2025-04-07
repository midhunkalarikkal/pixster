const NotUserSelected = () => {
  return (
    <div className="w-full hidden lg:flex flex-1 flex-col items-center justify-center p-4 md:p-16 bg-base-100/50">
      <div className="w-full text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative w-full space-y-2">
            <div className="chat chat-start">
              <div className="chat-bubble skeleton w-36 h-6 md:w-56 md:h-16 rounded-md"></div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble skeleton w-36 md:w-64 rounded-md"></div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble skeleton w-40 h-8 md:w-60 md:h-20 rounded-md"></div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble skeleton w-40 h-8 md:w-56 md:h-12 rounded-md"></div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble skeleton w-32 h-6 md:w-56 md:h-16 rounded-md"></div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble skeleton w-24 h-6 md:w-32 md:h-8 rounded-md"></div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble skeleton w-40 h-8 md:w-60 md:h-20 rounded-md"></div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble skeleton w-32 h-6 md:w-56 md:h-16 rounded-md"></div>
            </div>
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-bold">Search And Explore Talkzy</h2>
        <p className="text-base-content/60 text-xs md:text-md">
          Select an user from the sidebar to start explore
        </p>
      </div>
    </div>
  );
};

export default NotUserSelected;
