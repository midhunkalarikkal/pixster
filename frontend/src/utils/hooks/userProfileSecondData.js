import { useEffect } from "react";

export const useProfileSecondData = (
    {setUserPosts, 
    setUserSavedPosts, 
    authUserId, 
    userDataId, 
    setUserPostsLoading,
    getUserPosts,
    setUserSavedPostsLoading,
    getUserSavedPosts,
    setUserThreadsLoading,
    getUserThreads,
    setUserThreads,
    status,
    accountType}
) => {
     useEffect(() => {
        const fetchData = async () => {
          setUserPosts([]);
          setUserSavedPosts([]);
      
          if (authUserId === userDataId) {
            setUserPostsLoading(true);
            const posts = await getUserPosts({ userId: authUserId });
            setUserPosts(posts);
            setUserPostsLoading(false);
      
            setUserSavedPostsLoading(true);
            const savedPosts = await getUserSavedPosts();
            setUserSavedPosts(savedPosts);
            setUserSavedPostsLoading(false);
    
            setUserThreadsLoading(true);
            const threads = await getUserThreads({ userId : authUserId });
            setUserThreads(threads);
            setUserThreadsLoading(false);
          } else if (status === "accepted" || accountType || status === "followed") {
            setUserPostsLoading(true);
            const posts = await getUserPosts({ userId: userDataId });
            setUserPosts(posts);
            setUserPostsLoading(false);
          }
        };
      
        fetchData();
      }, [authUserId, userDataId, status]);
}