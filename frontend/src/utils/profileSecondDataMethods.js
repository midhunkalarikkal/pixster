export const handlePostDelete = (id, setUserPosts, updatepostCount) => {
    setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    updatepostCount();
  };
  
  export const handleThreadDelete = (id, setUserThreads, updatepostCount) => {
    setUserThreads((prevThreads) => prevThreads.filter((thread) => thread._id !== id));
    updatepostCount();
  };
  
  export const handleRemoveFromSaved = (id, setUserSavedPosts) => {
    setUserSavedPosts((prevSavedPosts) =>
      prevSavedPosts.filter((post) => post._id !== id)
    );
  };